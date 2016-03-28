import * as types from '../types/standard';

import requireMutations from '../helpers/requireMutations';
import RootResourceMutator from '../builders/RootResourceMutator';

const { createSession, deleteSession } = new RootResourceMutator(() => ({
  name: 'Session',
  type: () => require('../types/Session'),
  attributes: () => ({
    email: new types.GraphQLNonNull(types.GraphQLString),
    password: new types.GraphQLNonNull(types.GraphQLString)
  })
}));

module.exports = {
  createSession,
  deleteSession
};
