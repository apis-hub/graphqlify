import * as types from '../types/standard';

import _ from 'lodash';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import fetchTypeById from '../helpers/fetchTypeById';
import resolveMaybeThunk from '../helpers/resolveMaybeThunk';
import BaseMutator from './BaseMutator';
import { collectionToEdges } from '../helpers/connectionHelpers';

_.mixin(require('lodash-inflection'));

// Build the create mutation
function buildCreateMutation(mutator) {
  return mutationWithClientMutationId({
    // Give the mutation a name
    name: `create${mutator.singularName}`,
    inputFields: () => mutator.createInputFields,
    outputFields: () => mutator.createOutputFields,

    // Mutate
    mutateAndGetPayload: (args, context) => {
      let parentId = args[`${_.singularize(mutator.parentType.resource)}_id`];
      return getRelatedFromContext(
        mutator, parentId, context
      ).then(({ collection, parentInstance }) => {
        return collection.create(
          { attributes: args.attributes }
        ).then(resultResponse => {
          return { resultResponse, parentInstance };
        });
      });
    }
  });
}

// Build the create resource field
function buildCreateResourceOutputField({ relationship: relName, edgeType }) {
  let fields = {};
  fields[_.camelCase(`created_${_.singularize(relName)}_edge`)] = {
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

function buildUpdateMutation(mutator) {
  return mutationWithClientMutationId({
    // Give the mutation a name
    name: `update${mutator.singularName}`,
    inputFields: () => mutator.updateInputFields,
    outputFields: () => mutator.updateOutputFields,

    // Mutate
    mutateAndGetPayload: (args, context) => {
      let parentGId = args[`${_.singularize(mutator.parentType.resource)}_id`];
      let { id: parentId } = fromGlobalId(parentGId);
      let { parentType } = mutator;
      let { resource: parentResource } = parentType;
      let { id: globalId } = args;
      let { rootValue } = context;
      let { api } = rootValue;
      let { resource } = mutator;
      let parentInstance =
        api.resource(parentResource).new({ id: parentId });
      return getMinimalInstance(
        api, resource, globalId
      ).then(({ instance }) => {
        return instance.updateAttributes(args.attributes).then(({ response }) => {
          return { resultResponse: response, parentInstance };
        });
      });
    }
  });
}

function buildDeleteMutation(mutator) {
  return mutationWithClientMutationId({
    // Give the mutation a name
    name: `delete${mutator.singularName}`,
    inputFields: () => mutator.deleteInputFields,
    outputFields: () => mutator.deleteOutputFields,

    // Mutate
    mutateAndGetPayload: (args, context) => {
      let parentGId = args[`${_.singularize(mutator.parentType.resource)}_id`];
      let { id: parentId } = fromGlobalId(parentGId);
      let { parentType } = mutator;
      let { resource: parentResource } = parentType;
      let { id: globalId } = args;
      let { rootValue } = context;
      let { api } = rootValue;
      let { resource } = mutator;
      let parentInstance =
        api.resource(parentResource).new({ id: parentId });
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

// Mutate a relationship given a method
function buildRelationshipMutation(mutator, method) {
  let { pluralName, parentType } = mutator;
  return mutationWithClientMutationId({
    // Give the mutation a name
    name: `${method}${pluralName}`,

    // Extend the inputFields to include the ids
    inputFields: () => mutator[`${method}InputFields`],
    outputFields: () => mutator[`${method}OutputFields`],

    // Specify how the mutation gets invoked
    mutateAndGetPayload: (args, context) => {
      let parentId = args[`${_.singularize(parentType.resource)}_id`];
      return getRelationshipFromContext(
        mutator, parentId, context
      ).then(({ parentInstance, relationship: rel }) => {
        // Convert Ids
        let ids = globalIdsToRelationshipIds(args.ids);
        // Commit the relationship change
        return rel[method](ids).then(({ relationship: newRel }) => {
          return { relationship: newRel, parentInstance };
        });
      });
    }
  });
}

function buildIdsInputField() {
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
        [ nodeName ]
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
          resource, id, context, {}, nodeName, [ 'node' ])
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
  let { id } = fromGlobalId(globalId);
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
    let { type, id } = fromGlobalId(gid);
    type = _.pluralize(_.snakeCase(type));
    return { type, id };
  });
}

// Related Resource Mutator
class RelatedResourceMutator extends BaseMutator {
  constructor(options) {
    super(options);
    this.defGetter(
      `create${this.singularName}`,
      () => buildCreateMutation(this)
    );
    this.defGetter(
      `update${this.singularName}`,
      () => buildUpdateMutation(this)
    );
    this.defGetter(
      `add${this.pluralName}`,
      () => buildRelationshipMutation(this, 'add')
    );
    this.defGetter(
      `remove${this.pluralName}`,
      () => buildRelationshipMutation(this, 'remove')
    );
    this.defGetter(
      `replace${this.pluralName}`,
      () => buildRelationshipMutation(this, 'replace')
    );
    this.defGetter(
      `delete${this.singularName}`,
      () => buildDeleteMutation(this)
    );
  }

  get options() {
    return {
      addInputFields: {},
      addOutputFields: {},
      removeInputFields: {},
      removeOutputFields: {},
      replaceInputFields: {},
      replaceOutputFields: {},
      ...super.options
    };
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

  get createOutputFields() {
    return {
      ...this.outputFields,
      ...resolveMaybeThunk(this.options.createOutputFields),
      ...buildCreateResourceOutputField(this)
    };
  }

  get addInputFields() {
    return {
      ...this.inputFields,
      ...buildIdsInputField(),
      ...resolveMaybeThunk(this.options.addInputFields)
    };
  }

  get addOutputFields() {
    return {
      ...this.outputFields,
      ...buildRelationshipOutputFields(this),
      ...resolveMaybeThunk(this.options.updateOutputFields)
    };
  }

  get removeInputFields() {
    return {
      ...this.inputFields,
      ...buildIdsInputField(),
      ...resolveMaybeThunk(this.options.removeInputFields)
    };
  }

  get removeOutputFields() {
    return {
      ...this.outputFields,
      ...buildRelationshipOutputFields(this),
      ...resolveMaybeThunk(this.options.updateOutputFields)
    };
  }

  get replaceInputFields() {
    return {
      ...this.inputFields,
      ...buildIdsInputField(),
      ...resolveMaybeThunk(this.options.replaceInputFields)
    };
  }

  get replaceOutputFields() {
    return {
      ...this.outputFields,
      ...buildRelationshipOutputFields(this),
      ...resolveMaybeThunk(this.options.updateOutputFields)
    };
  }
}

export default RelatedResourceMutator;
