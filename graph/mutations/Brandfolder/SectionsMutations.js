import * as types from '../../types/standard';

import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { createBrandfoldersSection, deleteBrandfoldersSection } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/Section'),
    parentType: () => require('../../types/Brandfolder'),
    relationship: 'sections',
    createAttributes: () => ({
      name: new types.GraphQLNonNull(types.GraphQLString),
      position: new types.GraphQLNonNull(types.GraphQLInt),
      default_asset_type: new types.GraphQLNonNull(types.GraphQLString)
    })
  }));

export { createBrandfoldersSection, deleteBrandfoldersSection };
