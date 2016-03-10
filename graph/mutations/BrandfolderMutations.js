import buildRootResourceMutations from '../helpers/buildRootResourceMutations';
import * as types from '../types/standard';

const { updateBrandfolder, deleteBrandfolder } =
  buildRootResourceMutations(() => ({
    type: require('../types/Brandfolder'),
    inputFields: {
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
    }
  }));

export { updateBrandfolder, deleteBrandfolder };
