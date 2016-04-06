import * as types from '../types/standard';

import RelatedResourceMutator from '../builders/RelatedResourceMutator';
import { lazyMerge, lazyPickBy } from './lazy';

class MutationBuilder {
  constructor(opts) {
    this.mutator = new RelatedResourceMutator(() => opts);
  }

  pick(...names) {
    return lazyPickBy(
      this.mutator, name => names.find(n => name.indexOf(n) === 0)
    );
  }
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
    buildUserPermissionMutations(parentType)
  );
}

export default buildRoleMutations;
