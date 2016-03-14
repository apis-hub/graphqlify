import RootResourceMutator from '../helpers/RootResourceMutator';
import * as types from '../types/standard';

const { createUser, updateUser, deleteUser } = new RootResourceMutator(() => ({
  name: 'User',
  type: () => require('../types/User'),
  attributes: () => ({
    first_name: types.GraphQLString,
    last_name: types.GraphQLString,
    email: new types.GraphQLNonNull(types.GraphQLString),
    password: new types.GraphQLNonNull(types.GraphQLString)
  })
}));

export { createUser, updateUser, deleteUser };
