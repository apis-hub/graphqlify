import ApiResourceType from '../helpers/ApiResourceType';
import * as types from './standard';

const accessRequestType = new ApiResourceType('AccessRequest', () => ({
  attributes: {
    email: new types.GraphQLNonNull(types.GraphQLString),
    active: new types.GraphQLNonNull(types.GraphQLBoolean),
    prompt_response: types.GraphQLString,
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    brandfolder: require('./Brandfolder')
  }
}));

module.exports = accessRequestType;
