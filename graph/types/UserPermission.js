import buildResourceType from '../helpers/buildResourceType';
import * as types from './standard';

const userPermissionType = buildResourceType('UserPermission', () => ({
  attributes: {
    permission_level: new types.GraphQLNonNull(types.GraphQLString),
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    user: require('./User').type
  }
}));

module.exports = userPermissionType;
