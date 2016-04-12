import * as types from '../types/standard';

import requireMutations from '../helpers/requireMutations';
import RootResourceMutator from '../builders/RootResourceMutator';
import { lazyMerge } from '../helpers/lazy';

const { updateCollection, deleteCollection } = new RootResourceMutator(() => ({
  name: 'Collection',
  type: () => require('../types/Collection'),
  attributes: () => ({
    name: types.GraphQLString,
    slug: types.GraphQLString,
    private: types.GraphQLBoolean,
    public: types.GraphQLBoolean,
    stealth: types.GraphQLBoolean,
    card_image: types.GraphQLString,
    header_image: types.GraphQLString,
  }),
  createAttributes: () => ({
    name: new types.GraphQLNonNull(types.GraphQLString)
  }),
  updateAttributes: () => ({
    bulk_invitations: { type: new types.GraphQLInputObjectType({
      name: 'CollectionInvitationsInput',
      fields: {
        emails: { type: new types.GraphQLList(types.GraphQLString) },
        permission_level: { type: types.GraphQLString },
        personal_message: { type: types.GraphQLString }
      }
    }) }
  })
}));

module.exports = lazyMerge(
  { updateCollection, deleteCollection },
  requireMutations('Collection/AssetsMutations'),
  requireMutations('Collection/UsersMutations')
);
