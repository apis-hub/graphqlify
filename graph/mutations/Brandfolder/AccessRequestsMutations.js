import * as types from '../../types/standard';

import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { createBrandfoldersAccessRequest } = new RelatedResourceMutator(() => ({
  type: () => require('../../types/AccessRequest'),
  parentType: () => require('../../types/Brandfolder'),
  relationship: 'access_requests',
  createAttributes: () => ({
    email: new types.GraphQLNonNull(types.GraphQLString),
    prompt_response: types.GraphQLString
  })
}));

export { createBrandfoldersAccessRequest };
