import buildRoleMutations from '../../helpers/buildRoleMutations';

module.exports = buildRoleMutations({
  parentType: () => require('../../types/Brandfolder'),
  roles: [ 'admins', 'collaborators', 'guests' ]
});
