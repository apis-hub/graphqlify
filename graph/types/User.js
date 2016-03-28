import * as types from './standard';

import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';

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
      collections: requireType('Collection'),
      sessions: requireType('Session')
    }
  };
});

module.exports = userType;
