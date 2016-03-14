import { GraphQLObjectType } from 'graphql/type';
import requireMutations from '../helpers/requireMutations';

let mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...requireMutations('AssetApprovalMutations'),
    ...requireMutations('AssetCommentMutations'),
    ...requireMutations('AssetMutations'),
    ...requireMutations('AttachmentMutations'),
    ...requireMutations('BrandfolderMutations'),
    ...requireMutations('CollectionMutations'),
    ...requireMutations('InvitationMutations'),
    ...requireMutations('OrganizationMutations'),
    ...requireMutations('SectionMutations'),
    ...requireMutations('SocialLinkMutations'),
    ...requireMutations('UserMutations'),
    ...requireMutations('UserPermissionMutations')
  })
});

export default mutationType;
