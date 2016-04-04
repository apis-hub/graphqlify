import * as types from '../types/standard';

import RelatedResourceMutator from '../builders/RelatedResourceMutator';
import { lazyMerge, lazyPickBy } from './lazy';

class MutationBuilder {
  constructor({ parentType, relationship, type, attributes }) {
    this.mutator = new RelatedResourceMutator(() => ({
      type,
      parentType,
      relationship,
      attributes
    }));
  }

  pick(...names) {
    return lazyPickBy(
      this.mutator, name => names.find(n => name.indexOf(n) === 0)
    );
  }
}

function buildInvitationMutations(parentType) {
  let builder = new MutationBuilder({
    parentType,
    type: () => require('../types/Invitation'),
    attributes: () => ({
      email: new types.GraphQLNonNull(types.GraphQLString),
      personal_message: types.GraphQLString,
      permission_level: new types.GraphQLNonNull(types.GraphQLString)
    }),
    relationship: 'invitations'
  });
  return builder.pick('create', 'delete');
}

function buildUserPermissionMutations(parentType) {
  let builder = new MutationBuilder({
    parentType,
    type: () => require('../types/UserPermission'),
    attributes: () => ({
      email: new types.GraphQLNonNull(types.GraphQLString),
      permission_level: new types.GraphQLNonNull(types.GraphQLString)
    }),
    relationship: 'user_permissions'
  });
  return builder.pick('create', 'delete');
}

function buildUserMutations(parentType, roles) {
  let type = () => require('../types/User');
  return roles.reduce((mutations, relationship) => {
    let builder = new MutationBuilder({
      parentType,
      type,
      relationship
    });
    return lazyMerge(mutations, builder.pick('add', 'remove'));
  }, {});
}

function buildRoleMutations({ parentType, roles }) {
  return lazyMerge(
    buildUserMutations(parentType, roles),
    buildUserPermissionMutations(parentType),
    buildInvitationMutations(parentType)
  );
}

export default buildRoleMutations;
