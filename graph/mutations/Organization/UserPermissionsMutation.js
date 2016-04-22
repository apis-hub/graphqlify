import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { deleteOrganizationsUserPermission } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/UserPermission'),
    parentType: () => require('../../types/Organization'),
    relationship: 'user_permissions'
  }));

export { deleteOrganizationsUserPermission };
