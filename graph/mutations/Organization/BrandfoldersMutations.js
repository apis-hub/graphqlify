import RelatedResourceMutator from '../../builders/RelatedResourceMutator';
import * as types from '../../types/standard';

const { createOrganizationsBrandfolder, deleteOrganizationsBrandfolder } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/Brandfolder'),
    parentType: () => require('../../types/Organization'),
    relationship: 'brandfolders',
    attributes: () => ({
      name: new types.GraphQLNonNull(types.GraphQLString)
    })
  }));

export { createOrganizationsBrandfolder, deleteOrganizationsBrandfolder };
