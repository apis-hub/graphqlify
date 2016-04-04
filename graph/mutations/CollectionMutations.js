import RootResourceMutator from '../builders/RootResourceMutator';
import * as types from '../types/standard';
import requireMutations from '../helpers/requireMutations';
import { lazyMerge } from '../helpers/lazy';

const { updateCollection, deleteCollection } = new RootResourceMutator(() => ({
  name: 'Collection',
  type: () => require('../types/Collection'),
  attributes: () => ({
    slug: types.GraphQLString,
    name: types.GraphQLString,
    private: types.GraphQLBoolean,
    public: types.GraphQLBoolean,
    stealth: types.GraphQLBoolean,
    card_image: types.GraphQLString,
    header_image: types.GraphQLString
  })
}));

module.exports = lazyMerge(
  { updateCollection, deleteCollection },
  requireMutations('Collection/AssetsMutations'),
  requireMutations('Collection/UsersMutations')
);
