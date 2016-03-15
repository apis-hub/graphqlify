import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import _ from 'lodash';
import * as types from '../types/standard';
import { catchUnauthorized } from './catchErrors';
import { collectionToEdges } from './connectionHelpers';
import fetchTypeById from '../helpers/fetchTypeById';
import { CreateAttributesType } from './buildAttributesType';
import buildAttributesField from './buildAttributesField';
import BaseMutator from './BaseMutator';
import resolveMaybeThunk from './resolveMaybeThunk';

_.mixin(require('lodash-inflection'));

// Build the create mutation
function buildCreateMutation(mutator) {
  return mutationWithClientMutationId({
    // Give the mutation a name
    name: `create${mutator.name}`,

    // Extend the inputFields to include the attributesType
    inputFields: () => ({
      ...mutator.inputFields,
      ...buildAttributesField(mutator.name, mutator.attributes, CreateAttributesType)
    }),

    // Extend the outputFields to include the resultResponse
    outputFields: () => {
      return {
        ...mutator.outputFields,
        ...buildCreateResourceOutputField(mutator)
      };
    },

    // Mutate
    mutateAndGetPayload: (args, context) => {
      let parent_id = args[`${_.singularize(mutator.parentType.resource)}_id`];
      return getRelatedFromContext(
        mutator, parent_id, context
      ).then(({ collection, parentInstance }) => {
        return collection.create({ attributes: args.attributes }).then(resultResponse => {
          return { resultResponse, parentInstance };
        });
      }).catch(catchUnauthorized(
        context.rootValue
      ));
    }
  });
}

// Build the create resource field
function buildCreateResourceOutputField({ relationship: relationshipName, edgeType }) {
  let fields = {};
  fields[`${relationshipName}Edge`] = {
    type: edgeType,
    resolve: ({ resultResponse }) => {
      return resultResponse.collection.reload(
        { page: { first: 1 }, filter: { id: resultResponse.instance.id } }
      ).then(({ collection }) => {
        return collectionToEdges(collection)[0];
      });
    }
  };
  return fields;
}

// Mutate a relationship given a method
function buildRelationshipMutation(mutator, method) {
  let { outputFields, pluralName, inputFields, parentType } = mutator;
  return mutationWithClientMutationId({
    // Give the mutation a name
    name: `${method}${pluralName}`,

    // Extend the inputFields to include the ids
    inputFields: () => ({
      ...inputFields,
      ...buildIdsFields()
    }),

    // Extend the provided outputFields to include the globalids
    outputFields: () => ({
      ...outputFields,
      ...buildRelationshipOutputFields(mutator)
    }),

    // Specify how the mutation gets invoked
    mutateAndGetPayload: (args, context) => {
      let parent_id = args[`${_.singularize(parentType.resource)}_id`];
      return getRelationshipFromContext(
        mutator, parent_id, context
      ).then(({ parentInstance, relationship: rel }) => {
        // Convert Ids
        let ids = globalIdsToRelationshipIds(args.ids);
        // Commit the relationship change
        return rel[method](ids).then(({ relationship: newRel }) => {
          return { relationship: newRel, parentInstance };
        });
      }).catch(
        catchUnauthorized(context.rootValue)
      );
    }
  });
}

function buildIdsFields() {
  return {
    ids: {
      type: new types.GraphQLList(types.GraphQLID)
    }
  };
}

// Build the input type that includes the parent ID
function buildParentIdInputField({ parentType }) {
  let inputFields = {};
  inputFields[`${_.singularize(parentType.resource)}_id`] = {
    type: new types.GraphQLNonNull(types.GraphQLID)
  };
  return inputFields;
}

// Build the output type that includes the parent
function buildParentOutputField({ parentType }) {
  let fields = {};
  fields[_.singularize(parentType.resource)] = {
    type: new types.GraphQLNonNull(parentType.type),
    resolve: ({ parentInstance }, args, context) => {
      let nodeName = _.singularize(parentType.resource);
      return fetchTypeById(
        parentType.resource,
        parentInstance.id,
        context,
        {},
        nodeName
      );
    }
  };
  return fields;
}

// Relationship output fields
function buildRelationshipOutputFields({ relationship, resource, edgeType }) {
  let fields = {};
  let nodeName = `${relationship}Edge`;
  fields[nodeName] = {
    type: edgeType,
    resolve: ({ ids }, args, context) => {
      return Promise.all(
        ids.map(id => fetchTypeById(resource, id, context, {}, nodeName, 'node'))
      ).then(
        responses => collectionToEdges(responses.map(({ instance: i }) => i))
      );
    }
  };
  return fields;
}

// Get the parent
function getMinimalParent(api, resource, globalId) {
  var { id } = fromGlobalId(globalId);
  let parentParams = { fields: {} };
  parentParams.fields[resource] = null;
  return api.resource(resource).read(id, parentParams);
}

// Fetches a related collection, given the context and a parentResource
function getRelatedFromContext({ parentType, relationship: relationshipName }, parentId, { rootValue }) {
  return getMinimalParent(rootValue.api, parentType.resource, parentId).then(({ instance: parentInstance }) => {
    return parentInstance.related(relationshipName, { page: { first: 0 } }).then(({ collection }) => {
      return { collection, parentInstance };
    });
  });
}

// Fetches a relationship, given the context and a parentResource
function getRelationshipFromContext({ parentType, relationship: relationshipName }, parentId, { rootValue }) {
  return getMinimalParent(rootValue.api, parentType.resource, parentId).then(({ instance: parentInstance }) => {
    return parentInstance.relationship(relationshipName).then(({ relationship }) => {
      return { relationship, parentInstance };
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

// Related Resource Mutator
class RelatedResourceMutator extends BaseMutator {
  constructor(options) {
    super(options);
    this.defProperty(`create${this.singularName}`, { get: () => buildCreateMutation(this) });
    this.defProperty(`add${this.pluralName}`, { get: () => buildRelationshipMutation(this, 'add') });
    this.defProperty(`remove${this.pluralName}`, { get: () => buildRelationshipMutation(this, 'remove') });
    this.defProperty(`replace${this.pluralName}`, { get: () => buildRelationshipMutation(this, 'replace') });
  }

  get name() {
    return `${_.pluralize(this.parentType.type.name)}${_.upperFirst(_.camelCase(this.relationship))}`;
  }

  get singularName() {
    return _.singularize(this.name);
  }

  get pluralName() {
    return _.pluralize(this.name);
  }

  get edgeType() {
    return resolveMaybeThunk(this.options.type).edgeType;
  }

  get parentType() {
    return resolveMaybeThunk(this.options.parentType);
  }

  get relationship() {
    return this.options.relationship;
  }

  get inputFields() {
    return {
      ...super.inputFields,
      ...buildParentIdInputField(this)
    };
  }

  get outputFields() {
    return {
      ...super.outputFields,
      ...buildParentOutputField(this)
    };
  }
}

export default RelatedResourceMutator;
