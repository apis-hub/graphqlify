import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import buildAttributesField from './concerns/buildAttributesField';
import buildIdInputField from './concerns/buildIdInputField';
import buildResourceOutputField from './concerns/buildResourceOutputField';
import resolveMaybeThunk from '../helpers/resolveMaybeThunk';
import BaseMutator from './BaseMutator';
import { catchUnauthorized } from '../helpers/catchErrors';
import { UpdateAttributesType } from './AttributeTypes';

// Create Mutation
function buildCreateMutation(mutator) {
  return mutationWithClientMutationId({
    name: `create${mutator.name}`,
    inputFields: () => mutator.createInputFields,
    outputFields: () => mutator.createOutputFields,
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
    inputFields: () => mutator.updateInputFields,
    outputFields: () => mutator.updateOutputFields,
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
    inputFields: () => mutator.deleteInputFields,
    outputFields: () => mutator.deleteOutputFields,
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

  get options() {
    return {
      updateInputFields: {},
      updateOutputFields: {},
      ...super.options
    };
  }

  get updateInputFields() {
    return {
      ...this.inputFields,
      ...resolveMaybeThunk(this.options.updateInputFields),
      ...buildIdInputField(),
      ...buildAttributesField(this.name, this.attributes, UpdateAttributesType)
    };
  }

  get updateOutputFields() {
    return {
      ...this.outputFields,
      ...resolveMaybeThunk(this.options.updateOutputFields),
      ...buildResourceOutputField(this, 'updated')
    };
  }

}

export default RootResourceMutator;
