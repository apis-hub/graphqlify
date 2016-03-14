import buildRoleMutations from '../../helpers/buildRoleMutations';

module.exports = buildRoleMutations({
  parentType: () => require('../../types/Organization'),
  roles: [ 'owners', 'admins', 'collaborators', 'guests' ]
});
