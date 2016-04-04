import ApiResourceType from '../builders/ApiResourceType';
import requireType from '../helpers/requireType';
import * as types from './standard';

const accessRequestType = new ApiResourceType('AccessRequest', () => ({
  attributes: {
    email: types.GraphQLString,
    prompt_response: types.GraphQLString,
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    brandfolder: requireType('Brandfolder'),
  }
}));

module.exports = accessRequestType;
