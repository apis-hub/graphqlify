import RelatedResourceMutator from '../../helpers/RelatedResourceMutator';

const { addCollectionsAssets, removeCollectionsAssets } = new RelatedResourceMutator(() => ({
  type: () => require('../../types/Asset'),
  parentType: () => require('../../types/Collection'),
  relationship: 'assets'
}));

export { addCollectionsAssets, removeCollectionsAssets };
