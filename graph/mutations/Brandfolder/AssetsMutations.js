import RelatedResourceMutator from '../../helpers/RelatedResourceMutator';

const { removeBrandfoldersAssets } = new RelatedResourceMutator(() => ({
  type: () => require('../../types/Asset'),
  parentType: () => require('../../types/Brandfolder'),
  relationship: 'assets'
}));

export { removeBrandfoldersAssets };
