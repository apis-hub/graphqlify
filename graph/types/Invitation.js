import * as types from './standard';

import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';
import { iface as permissibleInterface } from '../interfaces/Permissible';

const invitationType = new ApiResourceType('Invitation', () => ({
  attributes: {
    email: new types.GraphQLNonNull(types.GraphQLString),
    permission_level: new types.GraphQLNonNull(types.GraphQLString),
    personal_message: types.GraphQLString,
    active: new types.GraphQLNonNull(types.GraphQLBoolean),
    token: new types.GraphQLNonNull(types.GraphQLString),
    inviteable: permissibleInterface,
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    inviter: requireType('User')
  }
}));

module.exports = invitationType;
