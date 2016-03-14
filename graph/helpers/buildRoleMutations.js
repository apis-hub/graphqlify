import * as types from '../types/standard';
import RelatedResourceMutator from './RelatedResourceMutator';

function buildInvitationMutations(parentType) {
  let mutations = {};
  let type = () => require('../types/Invitation');
  let relationship = 'invitations';
  let attributes = () => ({
    email: new types.GraphQLNonNull(types.GraphQLString),
    permission_level: new types.GraphQLNonNull(types.GraphQLString)
  });
  let mutator = new RelatedResourceMutator(() => ({
    type,
    parentType,
    relationship,
    attributes
  }));
  let { pluralName } = mutator;
  mutations[`Add${pluralName}`] = mutator[`Add${pluralName}`];
  mutations[`Remove${pluralName}`] = mutator[`Remove${pluralName}`];
  return mutations;
}

function buildUserPermissionMutations(parentType) {
  let mutations = {};
  let type = () => require('../types/UserPermission');
  let relationship = 'user_permissions';
  let mutator = new RelatedResourceMutator(() => ({
    type,
    parentType,
    relationship
  }));
  let { pluralName } = mutator;
  mutations[`Add${pluralName}`] = mutator[`Add${pluralName}`];
  mutations[`Remove${pluralName}`] = mutator[`Remove${pluralName}`];
  return mutations;
}

function buildUserMutations(parentType, roles) {
  let type = () => require('../types/User');
  return roles.reduce((mutations, relationship) => {
    let mutator = new RelatedResourceMutator({
      type,
      parentType,
      relationship,
    });
    let { pluralName } = mutator;
    mutations[`Add${pluralName}`] = mutator[`Add${pluralName}`];
    mutations[`Remove${pluralName}`] = mutator[`Remove${pluralName}`];
    return mutations;
  }, {});
}

function buildRoleMutations({ parentType, roles }) {
  return {
    ...buildUserMutations(parentType, roles),
    ...buildUserPermissionMutations(parentType),
    ...buildInvitationMutations(parentType)
  };
}

export default buildRoleMutations;
