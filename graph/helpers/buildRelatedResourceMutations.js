import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import _ from 'lodash';
import * as types from '../types/standard';
import { catchUnauthorized } from './catchErrors';
import { collectionToEdges } from './connectionHelpers';
import fetchTypeById from '../helpers/fetchTypeById';
import buildAttributesType from './buildAttributesType';

_.mixin(require('lodash-inflection'));

function getMinimalParent(api, resource, globalId) {
  var { id } = fromGlobalId(globalId);
  var parentParams = { fields: {} };
  parentParams.fields[resource] = null;
  return api.resource(resource).read(id, parentParams);
}

// Fetches a relationship, given the context and a parentResource
function getRelationshipFromContext({ parentType, relationship: relationshipName }, parentId, { rootValue }) {
  return getMinimalParent(rootValue.api, parentType.resource, parentId).then(({ instance: parentInstance }) => {
    return parentInstance.relationship(relationshipName).then(({ relationship }) => {
      return { relationship, parentInstance };
    });
  });
}

// Fetches a related collection, given the context and a parentResource
function getRelatedFromContext({ parentType, relationship: relationshipName }, parentId, { rootValue }) {
  return getMinimalParent(rootValue.api, parentType.resource, parentId).then(({ instance: parentInstance }) => {
    return parentInstance.related(relationshipName, { page: { first: 0 } }).then(({ collection }) => {
      return { collection, parentInstance };
    });
  });
}

// Convert globalIds to resource names
function globalIdsToRelationshipIds(ids) {
  return ids.map(gid => {
    var { type, id } = fromGlobalId(gid);
    type = _.pluralize(_.snakeCase(type));
    return { type, id };
  });
}

// Related Resource Mutation
function buildRelatedResourceMutations(options) {
  options = options instanceof Function ? options() : options;
  var { inputFields: attributesFields = {}, outputFields = {}, type, relationship: relationshipName, parentType } = options;
  var name = `${parentType.type.name}${type.type.name}`;
  var { createAttributesType } = buildAttributesType(name, attributesFields);

  // Require a parentID on the input
  var inputFields = {};
  inputFields[`${_.singularize(parentType.resource)}_id`] = {
    type: new types.GraphQLNonNull(types.GraphQLID)
  };

  // Always return a parent in the output
  outputFields[_.singularize(parentType.resource)] = {
    type: new types.GraphQLNonNull(parentType.type),
    resolve: ({ parentInstance }, args, context) => {
      var nodeName = _.singularize(parentType.resource);
      return fetchTypeById(
        parentType.resource,
        parentInstance.id,
        context,
        {},
        nodeName
      );
    }
  };

  // Mutate a relationship given a method
  function mutateRelationship(method) {
    var relationshipOutputFields = _.extend({}, outputFields);
    relationshipOutputFields[`${relationshipName}Edge`] = {
      type: `${_.pluralize(type.type.name)}Edge`,
      resolve: ({ ids }, args, context) => {
        return Promise.all(
          ids.map(id => fetchTypeById(type.resource, id, context, {}, `${relationshipName}Edge`, 'node'))
        ).then(
          responses => collectionToEdges(
            responses.map(({ instance }) => instance)
          )
        );
      }
    };

    return mutationWithClientMutationId({
      // Give the mutation a name
      name: `${method}${_.pluralize(name)}`,

      // Extend the inputFields to include the ids
      inputFields: _.extend({
        ids: {
          type: new types.GraphQLList(types.GraphQLID)
        }
      }, inputFields),

      // Extend the provided outputFields to include the globalids
      outputFields: relationshipOutputFields,

      // Specify how the mutation gets invoked
      mutateAndGetPayload: (args, context) => {
        var parent_id = args[`${_.singularize(parentType.resource)}_id`];
        return getRelationshipFromContext(
          options, parent_id, context
        ).then(({ parentInstance, relationship: rel }) => {
          // Convert Ids
          var ids = globalIdsToRelationshipIds(args.ids);
          // Commit the relationship change
          return rel[method](ids).then(({ relationship }) => {
            return { relationship, parentInstance };
          });
        }).catch(
          catchUnauthorized(context.rootValue)
        );
      }
    });
  }

  // Create outputFields with a resultResponse
  var createOutputFields = _.extend({}, outputFields);
  createOutputFields[`${relationshipName}Edge`] = {
    type: type.edgeType,
    resolve: ({ resultResponse }) => {
      return resultResponse.collection.reload(
        { page: { first: 1 }, filter: { id: resultResponse.instance.id } }
      ).then(({ collection }) => {
        return collectionToEdges(collection)[0]
      });
    }
  };

  // Build the mutations
  var mutations = {};

  // Build the create mutation
  mutations[`create${name}`] = mutationWithClientMutationId({
    // Give the mutation a name
    name: `create${name}`,

    // Extend the inputFields to include the attributesType
    inputFields: _.extend({
      attributes: {
        type: createAttributesType
      }
    }, inputFields),

    // Extend the outputFields to include the resultResponse
    outputFields: createOutputFields,

    // Mutate
    mutateAndGetPayload: (args, context) => {
      var parent_id = args[`${_.singularize(parentType.resource)}_id`];
      return getRelatedFromContext(
        options, parent_id, context
      ).then(({ collection, parentInstance }) => {
        return collection.create({ attributes: args.attributes }).then(resultResponse => {
          return { resultResponse, parentInstance };
        });
      }).catch(catchUnauthorized(
        context.rootValue
      ));
    }
  });
  mutations[`add${_.pluralize(name)}`] = mutateRelationship('add');
  mutations[`remove${_.pluralize(name)}`] = mutateRelationship('remove');
  mutations[`replace${_.pluralize(name)}`] = mutateRelationship('replace');

  return mutations;
}

export default buildRelatedResourceMutations;
