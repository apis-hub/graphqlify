import ApiResourceType from '../helpers/ApiResourceType';
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
      organizations: require('./Organization'),
      brandfolders: require('./Brandfolder'),
      collections: require('./Collection')
    }
  };
});

module.exports = userType;
