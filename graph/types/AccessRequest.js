import ApiResourceType from '../builders/ApiResourceType';
import * as types from './standard';

const accessRequestType = new ApiResourceType('AccessRequest', () => ({
  attributes: {
    email: new types.GraphQLNonNull(types.GraphQLString),
    prompt_response: types.GraphQLString,
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    brandfolder: require('./Brandfolder')
  }
}));

module.exports = accessRequestType;
