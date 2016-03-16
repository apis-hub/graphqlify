import ApiResourceType from '../helpers/ApiResourceType';
import * as types from './standard';

const socialLinkType = new ApiResourceType('SocialLink', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    url: new types.GraphQLNonNull(types.GraphQLString),
    position: new types.GraphQLNonNull(types.GraphQLInt),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    brandfolder: require('./Brandfolder')
  }
}));

module.exports = socialLinkType;
