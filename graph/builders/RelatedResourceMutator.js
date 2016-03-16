import _ from 'lodash';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import * as types from '../types/standard';
import { catchUnauthorized } from '../helpers/catchErrors';
import fetchTypeById from '../helpers/fetchTypeById';
import { collectionToEdges } from '../helpers/connectionHelpers';
import { CreateAttributesType } from './AttributeTypes';
import buildAttributesField from './concerns/buildAttributesField';
import BaseMutator from './BaseMutator';
import resolveMaybeThunk from '../helpers/resolveMaybeThunk';

_.mixin(require('lodash-inflection'));

// Build the create mutation
function buildCreateMutation(mutator) {
  return mutationWithClientMutationId({
    // Give the mutation a name
    name: `create${mutator.singularName}`,

    // Extend the inputFields to include the attributesType
    inputFields: () => ({
      ...mutator.inputFields,
      ...buildAttributesField(
        mutator.name, mutator.attributes, CreateAttributesType
      )
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
        return collection.create(
          { attributes: args.attributes }
        ).then(resultResponse => {
          return { resultResponse, parentInstance };
        });
      }).catch(catchUnauthorized(
        context.rootValue
      ));
    }
  });
}

// Build the create resource field
function buildCreateResourceOutputField({ relationship: relName, edgeType }) {
  let fields = {};
  fields[`${relName}Edge`] = {
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

function buildDeleteMutation(mutator) {
  return mutationWithClientMutationId({
    // Give the mutation a name
    name: `delete${mutator.singularName}`,

    // Extend the inputFields to include the attributesType
    inputFields: () => ({
      ...mutator.inputFields,
      id: {
        type: new types.GraphQLNonNull(types.GraphQLID)
      }
    }),

    // Extend the outputFields to include the resultResponse
    outputFields: () => ({
      ...mutator.outputFields,
      ...buildDeleteResourceOutputFields(mutator)
    }),

    // Mutate
    mutateAndGetPayload: (args, context) => {
      let { resource: parentResource } = parentType;
      let { parentType } = mutator;
      let { id: globalId } = args;
      let { rootValue } = context;
      let { api } = rootValue;
      let { resource } = mutator;
      let parentInstance = resource(parentResource).new({ id: args.parent_id });
      return getMinimalInstance(
        api, resource, globalId
      ).then(({ instance }) => {
        return instance.delete().then(({ response }) => {
          let { id: deletedId } = instance;
          if (!response.ok) {
            throw new Error('could not delete');
          }
          return { deletedId, resultResponse: response, parentInstance };
        });
      });
    }
  });
}

function buildDeleteResourceOutputFields({ type }) {
  let outputFields = {};
  outputFields[`deleted${type.name}Id`] = {
    type: new types.GraphQLNonNull(types.GraphQLID),
    resolve: ({ deletedId }) => deletedId
  };
  return outputFields;
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
        ids.map(id => fetchTypeById(
          resource, id, context, {}, nodeName, 'node')
        )
      ).then(
        responses => collectionToEdges(responses.map(({ instance: i }) => i))
      );
    }
  };
  return fields;
}

// Get the parent
function getMinimalInstance(api, resource, globalId) {
  var { id } = fromGlobalId(globalId);
  let parentParams = { fields: {} };
  parentParams.fields[resource] = null;
  return api.resource(resource).read(id, parentParams);
}

// Fetches a related collection, given the context and a parentResource
function getRelatedFromContext(
  { parentType, relationship: relName }, parentId, { rootValue }
) {
  return getMinimalInstance(
    rootValue.api, parentType.resource, parentId
  ).then(({ instance: parentInstance }) => {
    return parentInstance.related(
      relName, { page: { first: 0 } }
    ).then(({ collection }) => {
      return { collection, parentInstance };
    });
  });
}

// Fetches a relationship, given the context and a parentResource
function getRelationshipFromContext(
  { parentType, relationship: relName }, parentId, { rootValue }
) {
  return getMinimalInstance(
    rootValue.api, parentType.resource, parentId
  ).then(({ instance: parentInstance }) => {
    return parentInstance.relationship(relName).then(({ relationship }) => {
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
    this.defProperty(
      `create${this.singularName}`,
      { get: () => buildCreateMutation(this) }
    );
    this.defProperty(
      `add${this.pluralName}`,
      { get: () => buildRelationshipMutation(this, 'add') }
    );
    this.defProperty(
      `remove${this.pluralName}`,
      { get: () => buildRelationshipMutation(this, 'remove') }
    );
    this.defProperty(
      `replace${this.pluralName}`,
      { get: () => buildRelationshipMutation(this, 'replace') }
    );
    this.defProperty(
      `delete${this.singularName}`,
      { get: () => buildDeleteMutation(this) }
    );
  }

  get name() {
    let pluralParentName = _.pluralize(this.parentType.type.name);
    let camelizedRel = _.upperFirst(_.camelCase(this.relationship));
    return `${pluralParentName}${camelizedRel}`;
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
