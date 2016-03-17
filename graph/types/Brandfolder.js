import { slugInterface } from '../interfaces/slug';
import ApiResourceType from '../builders/ApiResourceType';
import { permissibleInterface } from '../interfaces/permissible';
import requireType from '../helpers/requireType';
import * as types from './standard';

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
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    organization: requireType('Organization')
  },
  relatesToMany: {
    assets: require('./Asset'),
    sections: require('./Section'),
    collections: require('./Collection'),
    social_links: require('./SocialLink'),
    users: require('./User'),
    access_requests: require('./AccessRequest'),
    invitations: require('./Invitation'),
    ...require('./concerns/permissibleRelationships')()
  },
}), slugInterface, permissibleInterface);

module.exports = brandfolderType;
