import _ from 'lodash';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import * as types from '../types/standard';
import { catchUnauthorized } from '../helpers/catchErrors';
import { CreateAttributesType, UpdateAttributesType } from './AttributeTypes';
import buildAttributesField from './concerns/buildAttributesField';
import BaseMutator from './BaseMutator';

// Output Field for resource
function buildResourceOutputField({ name, type }) {
  let fields = {};
  fields[_.snakeCase(name)] = {
    type,
    resolve: ({ resultResponse }) => resultResponse
  };
  return fields;
}

// Id input field
function buildIdInputField() {
  return {
    id: {
      type: new types.GraphQLNonNull(types.GraphQLID)
    }
  };
}

// Create Mutation
function buildCreateMutation(mutator) {
  return mutationWithClientMutationId({
    name: `create${mutator.name}`,
    inputFields: () => ({
      ...mutator.inputFields,
      ...buildAttributesField(
        mutator.name, mutator.attributes, CreateAttributesType
      )
    }),
    outputFields: () => mutator.outputFields,
    mutateAndGetPayload: ({ attributes }, { rootValue }) => {
      return rootValue.api.resource(
        mutator.resource
      ).create({ attributes }).then(
        resultResponse => ({ resultResponse })
      ).catch(
        catchUnauthorized(rootValue)
      );
    }
  });
}

// Update Mutation
function buildUpdateMutation(mutator) {
  return mutationWithClientMutationId({
    name: `update${mutator.name}`,
    inputFields: () => ({
      ...mutator.inputFields,
      ...buildIdInputField(),
      ...buildAttributesField(
        mutator.name, mutator.attributes, UpdateAttributesType
      )
    }),
    outputFields: () => mutator.outputFields,
    mutateAndGetPayload: ({ id: globalId, attributes }, { rootValue }) => {
      let { id } = fromGlobalId(globalId);
      return rootValue.api.resource(
        mutator.resource
      ).read(id).then(({ instance }) => {
        return instance.updateAttributes(attributes);
      }).then(
        resultResponse => ({ resultResponse })
      ).catch(
        catchUnauthorized(rootValue)
      );
    }
  });
}

// Delete Mutation
function buildDeleteMutation(mutator) {
  return mutationWithClientMutationId({
    name: `delete${mutator.name}`,
    inputFields: () => ({
      ...mutator.inputFields,
      ...buildIdInputField(),
    }),
    outputFields: () => ({
      ...mutator.outputFields,
      ...buildDeleteResourceOutputFields(mutator)
    }),
    mutateAndGetPayload: ({ id: globalId }, { rootValue }) => {
      let { id } = fromGlobalId(globalId);
      return rootValue.api.resource(
        mutator.resource
      ).read(id).then(({ instance }) => {
        return instance.delete();
      }).then(
        resultResponse => ({ resultResponse, deletedId: globalId })
      ).catch(
        catchUnauthorized(rootValue)
      );
    }
  });
}

function buildDeleteResourceOutputFields({ type }) {
  let outputFields = {};
  outputFields[`deleted${type.name}Id`] = {
    type: new types.GraphQLNonNull(types.GraphQLID),
    resolve: ({ deletedId }) => deletedId
  };
  outputFields[`deleted${type.name}`] = {
    type,
    resolve: ({ resultResponse }) => {
      let { instance, response } = resultResponse;
      return { instance, response };
    }
  };
  return outputFields;
}

// Root Resource Mutator
class RootResourceMutator extends BaseMutator {

  constructor(options) {
    super(options);
    this.defProperty(
      `create${this.name}`, { get: () => buildCreateMutation(this) }
    );
    this.defProperty(
      `update${this.name}`, { get: () => buildUpdateMutation(this) }
    );
    this.defProperty(
      `delete${this.name}`, { get: () => buildDeleteMutation(this) }
    );
  }

  get outputFields() {
    return {
      ...super.outputFields,
      ...buildResourceOutputField(this)
    };
  }

}

export default RootResourceMutator;
