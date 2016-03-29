import * as types from './standard';

import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';

const userType = new ApiResourceType('User', () => {
  return {
    attributes: {
      first_name: types.GraphQLString,
      last_name: types.GraphQLString,
      email: types.GraphQLString,
      initials: types.GraphQLString,
      initials_colors: new types.GraphQLList(types.GraphQLString),
      gravatar_url: types.GraphQLString,
      ...require('./concerns/timestamps')
    },
    relatesToOne: {
      current_session: requireType('Session')
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
