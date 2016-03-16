import RelatedResourceMutator from '../../helpers/RelatedResourceMutator';
import * as types from '../../types/standard';

const { createBrandfoldersSection, deleteBrandfoldersSection } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/Section'),
    parentType: () => require('../../types/Brandfolder'),
    relationship: 'sections',
    attributes: () => ({
      name: new types.GraphQLNonNull(types.GraphQLString),
      position: new types.GraphQLNonNull(types.GraphQLInt)
    })
  }));

export { createBrandfoldersSection, deleteBrandfoldersSection };
