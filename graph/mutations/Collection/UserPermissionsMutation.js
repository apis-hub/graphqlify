import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { deleteCollectionsUserPermission } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/UserPermission'),
    parentType: () => require('../../types/Collection'),
    relationship: 'user_permissions'
  }));

export { deleteCollectionsUserPermission };
