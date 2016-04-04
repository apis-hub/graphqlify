import * as types from '../types/standard';

import requireMutations from '../helpers/requireMutations';
import RootResourceMutator from '../builders/RootResourceMutator';
import { lazyMerge } from '../helpers/lazy';

const { updateBrandfolder, deleteBrandfolder } =
  new RootResourceMutator(() => ({
    name: 'Brandfolder',
    type: () => require('../types/Brandfolder'),
    attributes: () => ({
      slug: types.GraphQLString,
      name: types.GraphQLString,
      tagline: types.GraphQLString,
      private: types.GraphQLBoolean,
      public: types.GraphQLBoolean,
      stealth: types.GraphQLBoolean,
      request_access_enabled: types.GraphQLBoolean,
      request_access_prompt: types.GraphQLString,
      whitelisted_domains: new types.GraphQLList(types.GraphQLString),
      password: types.GraphQLString,
      enable_simple_password: types.GraphQLBoolean,
      card_image: types.GraphQLString,
      header_image: types.GraphQLString,
      google_analytics_id: types.GraphQLString
    })
  }));

module.exports = lazyMerge(
  { updateBrandfolder, deleteBrandfolder },
  requireMutations('Brandfolder/AssetsMutations'),
  requireMutations('Brandfolder/CollectionsMutations'),
  requireMutations('Brandfolder/SocialLinksMutations'),
  requireMutations('Brandfolder/UsersMutations'),
  requireMutations('Brandfolder/AccessRequestsMutations'),
);
