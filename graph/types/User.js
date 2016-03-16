import ApiResourceType from '../builders/ApiResourceType';
import requireType from '../helpers/requireType';
import * as types from './standard';

const userType = new ApiResourceType('User', () => {
  return {
    attributes: {
      first_name: types.GraphQLString,
      last_name: types.GraphQLString,
      email: types.GraphQLString,
      ...require('./concerns/timestamps')
    },
    relatesToMany: {
      organizations: requireType('Organization'),
      brandfolders: requireType('Brandfolder'),
      collections: requireType('Collection')
    }
  };
});

module.exports = userType;
