const permissibleRelationships = (() => {
  let rels = [ 'admins', 'collaborators', 'guests' ].reduce((object, role) => {
    object[role] = require('../User');
    return object;
  }, {});

  rels.users = require('../User');
  rels.user_permissions = require('../UserPermission');

  return rels;
});

module.exports = permissibleRelationships;
