import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { createAssetsApproval, deleteAssetsApproval } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/AssetApproval'),
    parentType: () => require('../../types/Asset'),
    relationship: 'approvals'
  }));

export { createAssetsApproval, deleteAssetsApproval };
