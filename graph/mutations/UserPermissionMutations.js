import * as types from '../types/standard';

import RootResourceMutator from '../builders/RootResourceMutator';

const { updateUserPermission } =
  new RootResourceMutator(() => ({
    name: 'UserPermission',
    type: () => require('../types/UserPermission'),
    attributes: () => ({
      permission_level: new types.GraphQLNonNull(types.GraphQLString)
    })
  }));

export { updateUserPermission };
