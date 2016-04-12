import '../helpers/requireType';
import * as types from '../types/standard';

import requireType from '../helpers/requireType';
import RootResourceMutator from '../builders/RootResourceMutator';

const { createSession, deleteSession } = new RootResourceMutator(() => ({
  name: 'Session',
  type: () => requireType('Session'),
  createAttributes: () => ({
    email: new types.GraphQLNonNull(types.GraphQLString),
    password: new types.GraphQLNonNull(types.GraphQLString)
  }),
  updateAttributes: () => ({
    mfa_token: new types.GraphQLNonNull(types.GraphQLString)
  }),
  deleteOutputFields: () => ({
    session: {
      type: requireType('Session').type,
      resolve: ({ resultResponse }) => resultResponse
    }
  })
}));

module.exports = {
  createSession,
  deleteSession
};
