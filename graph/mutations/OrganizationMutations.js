import RootResourceMutator from '../builders/RootResourceMutator';
import * as types from '../types/standard';
import requireMutations from '../helpers/requireMutations';
import { lazyMerge } from '../helpers/lazy';

const { updateOrganization } = new RootResourceMutator(() => ({
  name: 'Organization',
  type: () => require('../types/Organization'),
  attributes: () => ({
    slug: new types.GraphQLNonNull(types.GraphQLString),
    name: new types.GraphQLNonNull(types.GraphQLString),
    bulk_invitations: { type: new types.GraphQLInputObjectType({
      name: 'OrganizationInvitationsInput',
      fields: {
        emails: { type: new types.GraphQLList(types.GraphQLString) },
        permission_level: { type: types.GraphQLString },
        personal_message: { type: types.GraphQLString }
      }
    }) }
  })
}));

module.exports = lazyMerge(
  { updateOrganization },
  requireMutations('Organization/BrandfoldersMutations'),
  requireMutations('Organization/UsersMutations')
);
