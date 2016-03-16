import ApiResourceType from '../helpers/ApiResourceType';
import * as types from './standard';

const userPermissionType = new ApiResourceType('UserPermission', () => ({
  attributes: {
    permission_level: new types.GraphQLNonNull(types.GraphQLString),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    user: require('./User')
  }
}));

module.exports = userPermissionType;
