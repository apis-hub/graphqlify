import * as types from '../standard';

module.exports = {
  created_at: new types.GraphQLNonNull(types.GraphQLString),
  updated_at: new types.GraphQLNonNull(types.GraphQLString)
};
