import * as types from './standard';

import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';

const sessionType = new ApiResourceType('Session', () => ({
  attributes: {
    location_name: new types.GraphQLNonNull(types.GraphQLString),
    authenticated: new types.GraphQLNonNull(types.GraphQLBoolean),
    last_active_at: new types.GraphQLNonNull(types.GraphQLString),
    token: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    user: requireType('User')
  },
  relatesToMany: {
    organizations: requireType('Organization')
  }
}));

module.exports = sessionType;
