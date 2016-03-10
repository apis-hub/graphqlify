import buildRootResourceMutations from '../helpers/buildRootResourceMutations';
import * as types from '../types/standard';

const { createUser, updateUser, deleteUser } =
  buildRootResourceMutations(() => ({
    type: require('../types/User'),
    inputFields: {
      first_name: types.GraphQLString,
      last_name: types.GraphQLString,
      email: new types.GraphQLNonNull(types.GraphQLString),
      password: new types.GraphQLNonNull(types.GraphQLString)
    }
  }));

export { createUser, updateUser, deleteUser };
