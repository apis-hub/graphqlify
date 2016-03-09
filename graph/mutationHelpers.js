import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import _ from 'lodash';
import * as types from './GraphQLTypes';
import { catchUnauthorized } from '../lib/catchUnauthorized';

_.mixin(require('lodash-inflection'));

// Fetches a relationship, given the context and a parentResource
function getRelationshipFromContext({ parentType, relationship: relationshipName }, parentId, { rootValue }) {
  var { id } = fromGlobalId(parentId);
  return rootValue.api.resource(parentType.resource).read(id).then(({ instance: parentInstance }) => {
    return parentInstance.relationship(relationshipName).then(({ relationship }) => {
      return { relationship, parentInstance };
    });
  });
}

// Fetches a related collection, given the context and a parentResource
function getRelatedFromContext({ parentType, relationshipName }, parentId, { rootValue }) {
  var { id } = fromGlobalId(parentId);
  return rootValue.api.resource(parentType.resource).read(id).then(({ instance: parentInstance }) => {
    return parentInstance.related(relationshipName).then(({ collection }) => {
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

// Build the input type for attributes
function buildAttributesType(name, fields) {
  // Force shorthand into longhand
  _.reduce(fields, (result, value, key) => {
    if (result[key].type === undefined) {
      result[key] = { type: value };
    }
    return result;
  }, fields);

  return {
    createAttributesType: new types.GraphQLInputObjectType({
      name: `${name}CreateAttributes`,
      fields
    }),
    updateAttributesType: new types.GraphQLInputObjectType({
      name: `${name}UpdateAttributes`,
      fields: _.reduce(fields, (result, field) => {
        if (field.type instanceof types.GraphQLNonNull) {
          field.type = field.type.ofType;
        }
        return result;
      }, fields)
    })
  };
}

// Related Resource Mutation
function buildRelatedResourceMutations(options) {
  options = options instanceof Function ? options() : options;
  var { inputFields: attributesFields = {}, outputFields = {}, type, parentType } = options;
  var name = `${parentType.type.name}${type.type.name}`;
  var { createAttributesType } = buildAttributesType(name, attributesFields);

  // Require a parentID on the input
  var inputFields = {
    parent_id: {
      type: new types.GraphQLNonNull(types.GraphQLID)
    }
  };

  // Always return a parent in the output
  outputFields.parent = {
    type: new types.GraphQLNonNull(parentType.type),
    resolve: ({ parentResponse }) => parentResponse
  };

  // Mutate a relationship given a method
  function mutateRelationship(method) {
    mutationWithClientMutationId({
      // Give the mutation a name
      name: `${method}${_.pluralize(name)}`,

      // Extend the inputFields to include the ids
      inputFields: _.extend({
        ids: {
          type: new types.GraphQLList(types.GraphQLID)
        }
      }, inputFields),

      // Extend the provided outputFields to include the globalids
      outputFields: _.extend({
        ids: {
          type: new types.GraphQLList(types.GraphQLID),
          resolve: ({ relationship }) => relationship
        }
      }, outputFields),

      // Specify how the mutation gets invoked
      mutateAndGetPayload: ({ parent_id, ids: globalIds }, context) => {
        return getRelationshipFromContext(
          options, parent_id, context
        ).then(({ parentInstance, relationship: rel }) => {
          // Convert Ids
          var ids = globalIdsToRelationshipIds(globalIds);
          // Commit the relationship change
          return rel[method](ids).then(({ relationship }) => {
            // Reload the parent object
            return parentInstance.reload().then(parentResponse => {
              // Return the outputFields
              return { parentResponse, relationship };
            });
          });
        });
      }
    });
  }

  // Create outputFields with a resultResponse
  var createOutputFields = {};
  createOutputFields[_.snakeCase(type.type.name)] = {
    type: type.type,
    resolve: ({ resultResponse }) => resultResponse
  };

  // Build the mutations
  var mutations = {};

  // Override create to mutate on a relationship
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
    outputFields: _.extend(createOutputFields, outputFields),

    // Mutate
    mutateAndGetPayload: ({ parent_id, attributes }, context) => {
      return getRelatedFromContext(
        options, parent_id, context
      ).then(({ collection: col, parentInstance }) => {
        return col.create({ attributes }).then(({ instance, response }) => {
          var resultResponse = { instance, response };
          return parentInstance.reload().then(parentResponse => {
            return { parentResponse, resultResponse };
          });
        });
      });
    }
  });
  mutations[`add${_.pluralize(name)}`] = mutateRelationship('add');
  mutations[`remove${_.pluralize(name)}`] = mutateRelationship('remove');
  mutations[`replace${_.pluralize(name)}`] = mutateRelationship('replace');

  return mutations;
}

// Root Resource Mutation
function buildRootResourceMutations(options) {
  options = options instanceof Function ? options() : options;
  var { inputFields: attributesFields = {}, type, outputFields = {} } = options;
  var name = type.type.name;
  var { createAttributesType, updateAttributesType } = buildAttributesType(name, attributesFields);

  outputFields[_.snakeCase(name)] = {
    type: type.type,
    resolve: ({ resultResponse }) => resultResponse
  };

  // Build the Mutations
  var mutations = {};

  // Build the create mutation
  mutations[`create${name}`] = mutationWithClientMutationId({
    name: `create${name}`,
    inputFields: {
      attributes: {
        type: createAttributesType
      }
    },
    outputFields,
    mutateAndGetPayload: ({ attributes }, { rootValue }) => {
      return rootValue.api.resource(type.resource).create({ attributes }).then(
        resultResponse => ({ resultResponse })
      ).catch(
        catchUnauthorized(rootValue)
      );
    }
  });

  // Build the update mutation
  mutations[`update${name}`] = mutationWithClientMutationId({
    name: `update${name}`,
    inputFields: {
      id: {
        type: new types.GraphQLNonNull(types.GraphQLID)
      },
      attributes: {
        type: updateAttributesType
      }
    },
    outputFields,
    mutateAndGetPayload: ({ id: globalId, attributes }, { rootValue }) => {
      var { id } = fromGlobalId(globalId);
      return rootValue.api.resource(type.resource).read(id).then(({ instance }) => {
        return instance.updateAttributes(attributes);
      }).then(
        resultResponse => ({ resultResponse })
      ).catch(
        catchUnauthorized(rootValue)
      );
    }
  });

  // Build the delete mutation
  mutations[`delete${name}`] = mutationWithClientMutationId({
    name: `delete${name}`,
    inputFields: {
      id: {
        type: new types.GraphQLNonNull(types.GraphQLID)
      }
    },
    outputFields,
    mutateAndGetPayload: ({ id: globalId }, { rootValue }) => {
      var { id } = fromGlobalId(globalId);
      return rootValue.api.resource(type.resource).read(id).then(({ instance }) => {
        return instance.delete();
      }).then(
        resultResponse => ({ resultResponse })
      ).catch(
        catchUnauthorized(rootValue)
      );
    }
  });

  return mutations;
}

export { buildRootResourceMutations, buildRelatedResourceMutations };
