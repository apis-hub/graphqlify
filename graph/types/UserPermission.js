import ApiResourceType from '../builders/ApiResourceType';
import requireType from '../helpers/requireType';
import * as types from './standard';

const userPermissionType = new ApiResourceType('UserPermission', () => ({
  attributes: {
    permission_level: new types.GraphQLNonNull(types.GraphQLString),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    user: requireType('User')
  }
}));

module.exports = userPermissionType;
