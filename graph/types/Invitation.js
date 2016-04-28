import ApiResourceType from '../builders/ApiResourceType';
import requireType from '../helpers/requireType';
import * as types from './standard';

const invitationType = new ApiResourceType('Invitation', () => ({
  attributes: {
    email: new types.GraphQLNonNull(types.GraphQLString),
    permission_level: new types.GraphQLNonNull(types.GraphQLString),
    personal_message: types.GraphQLString,
    active: types.GraphQLBoolean,
    token: new types.GraphQLNonNull(types.GraphQLString),
    inviteable: require('../interfaces/permissible').permissibleInterface,
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    inviter: requireType('User')
  }
}));

module.exports = invitationType;
