import { GraphQLObjectType } from 'graphql/type';

import requireMutations from '../helpers/requireMutations';

let mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...requireMutations('AccessRequestMutations'),
    ...requireMutations('AssetCommentMutations'),
    ...requireMutations('AssetMutations'),
    ...requireMutations('AttachmentMutations'),
    ...requireMutations('BrandfolderMutations'),
    ...requireMutations('CollectionMutations'),
    ...requireMutations('InvitationMutations'),
    ...requireMutations('OrganizationMutations'),
    ...requireMutations('SectionMutations'),
    ...requireMutations('SessionMutations'),
    ...requireMutations('SocialLinkMutations'),
    ...requireMutations('UserMutations'),
    ...requireMutations('UserPermissionMutations'),
    ...requireMutations('BulkSelectionMutations')
  })
});

export default mutationType;
