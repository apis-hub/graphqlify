import RelatedResourceMutator from '../../helpers/RelatedResourceMutator';

const { addAssetsApprovals, removeAssetsApprovals } = new RelatedResourceMutator(() => ({
  type: () => require('../../types/AssetApproval'),
  parentType: () => require('../../types/Asset'),
  relationship: 'approvals'
}));

export { addAssetsApprovals, removeAssetsApprovals };
