import { slugInterface } from '../interfaces/slug';
import { connectionType as userConnectionType } from './User';
import buildResourceType from '../helpers/buildResourceType';
import * as types from './standard';

const brandfolderType = buildResourceType('Brandfolder', () => ({
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
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    organization: require('./Organization').type
  },
  relatesToMany: {
    assets: require('./Asset').connectionType,
    sections: require('./Section').connectionType,
    collections: require('./Collection').connectionType,
    user_permissions: require('./UserPermission').connectionType,
    social_links: require('./SocialLink').connectionType,
    users: userConnectionType,
    admins: userConnectionType,
    collaborators: userConnectionType,
    guests: userConnectionType
  }
}), slugInterface);

module.exports = brandfolderType;
