import RootResourceMutator from '../builders/RootResourceMutator';
import * as types from '../types/standard';

const { updateAccessRequest } = new RootResourceMutator(() => ({
  type: () => require('../types/AccessRequest'),
  attributes: () => ({
    accepted: types.GraphQLBoolean
  })
}));

export { updateAccessRequest };
