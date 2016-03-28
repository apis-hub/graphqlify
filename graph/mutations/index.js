import { GraphQLObjectType } from 'graphql/type';

import requireMutations from '../helpers/requireMutations';

let mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...requireMutations('AssetCommentMutations'),
    ...requireMutations('AssetMutations'),
    ...requireMutations('BrandfolderMutations'),
    ...requireMutations('CollectionMutations'),
    ...requireMutations('InvitationMutations'),
    ...requireMutations('OrganizationMutations'),
    ...requireMutations('SectionMutations'),
    ...requireMutations('SessionMutations'),
    ...requireMutations('SocialLinkMutations'),
    ...requireMutations('UserMutations'),
    ...requireMutations('UserPermissionMutations')
  })
});

export default mutationType;
