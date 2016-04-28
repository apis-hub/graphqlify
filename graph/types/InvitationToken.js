import ApiResourceType from '../builders/ApiResourceType';
import * as types from './standard';

const invitationTokenType = new ApiResourceType('InvitationToken', () => ({
  attributes: {
    email: new types.GraphQLNonNull(types.GraphQLString),
    active: types.GraphQLBoolean,
    token: new types.GraphQLNonNull(types.GraphQLString),
    ...require('./concerns/timestamps')
  }
}));

module.exports = invitationTokenType;
