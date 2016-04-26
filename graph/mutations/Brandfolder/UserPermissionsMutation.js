import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { deleteBrandfoldersUserPermission } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/UserPermission'),
    parentType: () => require('../../types/Brandfolder'),
    relationship: 'user_permissions'
  }));

export { deleteBrandfoldersUserPermission };
