import requireType from '../../helpers/requireType';

const permissibleRelationships = (() => {
  let rels = [ 'admins', 'collaborators', 'guests' ].reduce((object, role) => {
    object[role] = require('../User');
    return object;
  }, {});

  rels.users = requireType('User');
  rels.user_permissions = requireType('UserPermission');
  rels.invitations = requireType('Invitation');

  return rels;
});

module.exports = permissibleRelationships;
