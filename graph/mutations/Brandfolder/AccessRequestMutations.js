import RootResourceMutator from '../builders/RootResourceMutator';
import * as types from '../types/standard';

const { createAccessRequest } = new RootResourceMutator(() => ({
  type: () => require('../types/AccessRequest'),
  attributes: () => ({
    email: types.GraphQLString,
    prompt_response: types.GraphQLString
  })
}));

module.exports = {
  createAccessRequest
};
