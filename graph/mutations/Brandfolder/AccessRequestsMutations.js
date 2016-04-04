import RelatedResourceMutator from '../../builders/RelatedResourceMutator';
import * as types from '../../types/standard';

const { createBrandfoldersAccessRequest } = new RelatedResourceMutator(() => ({
  type: () => require('../../types/AccessRequest'),
  parentType: () => require('../../types/Brandfolder'),
  relationship: 'access_requests',
  attributes: () => ({
    email: types.GraphQLString,
    prompt_response: types.GraphQLString
  })
}));

export { createBrandfoldersAccessRequest };
