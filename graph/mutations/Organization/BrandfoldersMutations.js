import * as types from '../../types/standard';

import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { createOrganizationsBrandfolder, deleteOrganizationsBrandfolder } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/Brandfolder'),
    parentType: () => require('../../types/Organization'),
    relationship: 'brandfolders',
    createAttributes: () => ({
      name: new types.GraphQLNonNull(types.GraphQLString)
    })
  }));

export { createOrganizationsBrandfolder, deleteOrganizationsBrandfolder };
