import * as types from '../types/standard';

import requireMutations from '../helpers/requireMutations';
import RootResourceMutator from '../builders/RootResourceMutator';
import { lazyMerge } from '../helpers/lazy';

const { createOrganization, updateOrganization } = new RootResourceMutator(() => ({
  name: 'Organization',
  type: () => require('../types/Organization'),
  attributes: () => ({
    slug: types.GraphQLString,
    name: types.GraphQLString
  }),
  createAttributes: () => ({
    slug: new types.GraphQLNonNull(types.GraphQLString),
    name: new types.GraphQLNonNull(types.GraphQLString),
    plan_name: new types.GraphQLNonNull(types.GraphQLString),
    credit_card_token: new types.GraphQLNonNull(types.GraphQLString),
    frequency: types.GraphQLString
  }),
  updateAttributes: () => ({
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
  { createOrganization, updateOrganization },
  requireMutations('Organization/BrandfoldersMutations'),
  requireMutations('Organization/UsersMutations')
);
