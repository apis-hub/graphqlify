import ApiResourceType from '../helpers/ApiResourceType';
import * as types from './standard';

const invitationType = new ApiResourceType('Invitation', () => ({
  attributes: {
    first_name: types.GraphQLString,
    last_name: types.GraphQLString,
    email: new types.GraphQLNonNull(types.GraphQLString),
    permission_level: new types.GraphQLNonNull(types.GraphQLString),
    personal_message: types.GraphQLString,
    active: types.GraphQLBoolean,
    token: new types.GraphQLNonNull(types.GraphQLString),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    inviter: require('./User')
  }
}));

module.exports = invitationType;
