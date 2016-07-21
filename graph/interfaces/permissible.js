import * as types from '../types/standard';

import requireType from '../helpers/requireType';
import ApiInterfaceType from '../builders/ApiInterfaceType';

module.exports = new ApiInterfaceType('Permissible', () => ({
  attributes: {
    slug: new types.GraphQLNonNull(types.GraphQLString),
    name: new types.GraphQLNonNull(types.GraphQLString),
  },
  relatesToMany: {
    user_permissions: requireType('UserPermission'),
    users: requireType('User'),
    invitations: requireType('Invitation'),
    access_requests: requireType('AccessRequest')
  }
}));
