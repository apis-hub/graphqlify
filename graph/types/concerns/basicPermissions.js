import * as types from '../standard';

const basicPermissions = [ 'can_read', 'can_update', 'can_delete' ].reduce(
  (object, canPermission) => {
    object[canPermission] = new types.GraphQLNonNull(types.GraphQLBoolean);
    return object;
  }, {}
);

module.exports = basicPermissions;
