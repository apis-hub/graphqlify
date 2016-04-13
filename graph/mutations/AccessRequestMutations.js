import * as types from '../types/standard';

import RootResourceMutator from '../builders/RootResourceMutator';

const { updateAccessRequest } =
  new RootResourceMutator(() => ({
    type: () => require('../types/AccessRequest'),
    updateAttributes: () => ({
      accepted: types.GraphQLBoolean
    })
  }));

export { updateAccessRequest };
