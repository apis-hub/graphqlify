import * as types from '../types/standard';

import RootResourceMutator from '../builders/RootResourceMutator';

const { createUser, updateUser, deleteUser } = new RootResourceMutator(() => ({
  name: 'User',
  type: () => require('../types/User'),
  createAttributes: () => ({
    email: new types.GraphQLNonNull(types.GraphQLString),
    password: new types.GraphQLNonNull(types.GraphQLString),
    token: new types.GraphQLNonNull(types.GraphQLString)
  }),
  attributes: () => ({
    first_name: types.GraphQLString,
    last_name: types.GraphQLString,
    email: types.GraphQLString,
    password: types.GraphQLString,
    initials: types.GraphQLString
  })
}));

export { createUser, updateUser, deleteUser };
