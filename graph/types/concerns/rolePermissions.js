import * as types from '../standard';

const rolePermissions = [ 'can_admin', 'can_collaborate', 'can_read' ].reduce(
  (object, canRole) => {
    object[canRole] = new types.GraphQLNonNull(types.GraphQLBoolean);
    return object;
  }, {}
);

module.exports = rolePermissions;
