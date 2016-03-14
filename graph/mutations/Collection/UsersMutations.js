import buildRoleMutations from '../../helpers/buildRoleMutations';

module.exports = buildRoleMutations({
  parentType: () => require('../../types/Collection'),
  roles: [ 'admins', 'collaborators', 'guests' ]
});
