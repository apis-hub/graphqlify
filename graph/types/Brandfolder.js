import * as types from './standard';

import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';
import ParamsType from '../builders/ParamsType';
import { permissibleInterface } from '../interfaces/permissible';
import { slugInterface } from '../interfaces/slug';

const searchParamsType = new ParamsType('Search', {
  description: 'The params for the search.',
  fields: {
    query: types.GraphQLString
  }
});

const brandfolderType = new ApiResourceType('Brandfolder', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    slug: new types.GraphQLNonNull(types.GraphQLString),
    tagline: types.GraphQLString,
    public: new types.GraphQLNonNull(types.GraphQLBoolean),
    private: new types.GraphQLNonNull(types.GraphQLBoolean),
    stealth: new types.GraphQLNonNull(types.GraphQLBoolean),
    request_access_enabled: new types.GraphQLNonNull(types.GraphQLBoolean),
    request_access_prompt: types.GraphQLString,
    whitelisted_domains: new types.GraphQLList(types.GraphQLString),
    enable_simple_password: new types.GraphQLNonNull(types.GraphQLBoolean),
    card_image: types.GraphQLString,
    header_image: types.GraphQLString,
    google_analytics_id: types.GraphQLString,
    feature_names: new types.GraphQLList(types.GraphQLString),
    number_of_assets: new types.GraphQLNonNull(types.GraphQLInt),
    number_of_collections: new types.GraphQLNonNull(types.GraphQLInt),
    number_of_sections: new types.GraphQLNonNull(types.GraphQLInt),
    ...require('./concerns/rolePermissions'),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    organization: requireType('Organization')
  },
  relatesToMany: {
    assets: requireType('Asset'),
    sections: requireType('Section'),
    collections: requireType('Collection'),
    social_links: requireType('SocialLink'),
    users: requireType('User'),
    access_requests: requireType('AccessRequest'),
    ...require('./concerns/permissibleRelationships')()
  },
  connectionArgs: {
    search: {
      type: searchParamsType
    }
  },
  fields: {
    can_own: {
      type: new types.GraphQLNonNull(types.GraphQLBoolean),
      resolve: () => false
    }
  }
}), slugInterface, permissibleInterface);

module.exports = brandfolderType;
