import * as types from '../../types/standard';

import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { createBrandfoldersSection, deleteBrandfoldersSection } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/Section'),
    parentType: () => require('../../types/Brandfolder'),
    relationship: 'sections',
    createAttributes: () => ({
      name: new types.GraphQLNonNull(types.GraphQLString),
      position: new types.GraphQLNonNull(types.GraphQLInt)
    })
  }));

export { createBrandfoldersSection, deleteBrandfoldersSection };
