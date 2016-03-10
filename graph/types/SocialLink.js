import buildResourceType from '../helpers/buildResourceType';
import * as types from './standard';

const socialLinkType = buildResourceType('SocialLink', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    url: new types.GraphQLNonNull(types.GraphQLString),
    position: new types.GraphQLNonNull(types.GraphQLInt),
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    brandfolder: require('./Brandfolder').type
  }
}));

module.exports = socialLinkType;
