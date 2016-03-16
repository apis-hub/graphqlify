import ApiResourceType from '../builders/ApiResourceType';
import requireType from '../helpers/requireType';
import * as types from './standard';

const socialLinkType = new ApiResourceType('SocialLink', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    url: new types.GraphQLNonNull(types.GraphQLString),
    position: new types.GraphQLNonNull(types.GraphQLInt),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    brandfolder: requireType('Brandfolder')
  }
}));

module.exports = socialLinkType;
