import buildResourceType from '../helpers/buildResourceType';
import * as types from './standard';

const userType = buildResourceType('User', () => ({
  attributes: {
    first_name: types.GraphQLString,
    last_name: types.GraphQLString,
    email: types.GraphQLString,
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToMany: {
    organizations: require('./Organization').connectionType,
    brandfolders: require('./Brandfolder').connectionType,
    collections: require('./Collection').connectionType
  }
}));

module.exports = userType;
