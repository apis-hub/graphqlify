import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import BaseMutator from './BaseMutator';
import expandRelationships from '../helpers/expandRelationships';

// Create Mutation
function buildCreateMutation(mutator) {
  return mutationWithClientMutationId({
    name: `create${mutator.name}`,
    inputFields: () => mutator.createInputFields,
    outputFields: () => mutator.createOutputFields,
    mutateAndGetPayload: ({ attributes, relationships }, { api }) => {
      return api.resource(
        mutator.resource
      ).create({ attributes, relationships }).then(
        resultResponse => ({ resultResponse })
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
    mutateAndGetPayload: ({ id: globalId, attributes, relationships }, { api }) => {
      let { id } = fromGlobalId(globalId);
      return api.resource(
        mutator.resource
      ).read(id).then(({ instance }) => {
        return instance.update({
          attributes,
          relationships: expandRelationships(relationships)
        });
      }).then(
        resultResponse => ({ resultResponse })
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
    mutateAndGetPayload: ({ id: globalId }, { api }) => {
      let { id } = fromGlobalId(globalId);
      return api.resource(
        mutator.resource
      ).read(id).then(({ instance }) => {
        return instance.delete();
      }).then(
        resultResponse => ({ resultResponse, deletedId: globalId })
      );
    }
  });
}

// Root Resource Mutator
class RootResourceMutator extends BaseMutator {

  constructor(options) {
    super(options);
    this.defGetter(
      `create${this.name}`, () => buildCreateMutation(this)
    );
    this.defGetter(
      `update${this.name}`, () => buildUpdateMutation(this)
    );
    this.defGetter(
      `delete${this.name}`, () => buildDeleteMutation(this)
    );
  }

}

export default RootResourceMutator;
