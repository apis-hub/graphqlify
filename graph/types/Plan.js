import buildResourceType from '../helpers/buildResourceType';
import * as types from './standard';

const planType = buildResourceType('Plan', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    brandfolder_limit: new types.GraphQLNonNull(types.GraphQLInt),
    brandfolder_count: new types.GraphQLNonNull(types.GraphQLInt),
    asset_limit: new types.GraphQLNonNull(types.GraphQLInt),
    asset_count: new types.GraphQLNonNull(types.GraphQLInt),
    collaborator_limit: new types.GraphQLNonNull(types.GraphQLInt),
    collaborator_count: new types.GraphQLNonNull(types.GraphQLInt),
    collection_limit: new types.GraphQLNonNull(types.GraphQLInt),
    collection_count: new types.GraphQLNonNull(types.GraphQLInt),
    api_call_limit: new types.GraphQLNonNull(types.GraphQLInt),
    api_call_count: new types.GraphQLNonNull(types.GraphQLInt),
    available_features: new types.GraphQLList(types.GraphQLString),
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    organization: require('./Organization').type,
  }
}));

module.exports = planType;
