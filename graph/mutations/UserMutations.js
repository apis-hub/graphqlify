import { buildRootResourceMutations } from '../mutationHelpers';
import * as types from '../GraphQLTypes';

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
