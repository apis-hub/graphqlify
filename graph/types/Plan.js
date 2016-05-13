import ApiResourceType from '../builders/ApiResourceType';
import requireType from '../helpers/requireType';
import * as types from './standard';

const planType = new ApiResourceType('Plan', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    brandfolder_limit: new types.GraphQLNonNull(types.GraphQLInt),
    brandfolder_count: new types.GraphQLNonNull(types.GraphQLInt),
    asset_limit: new types.GraphQLNonNull(types.GraphQLInt),
    asset_count: new types.GraphQLNonNull(types.GraphQLInt),
    collaborator_limit: new types.GraphQLNonNull(types.GraphQLInt),
    collaborator_count: new types.GraphQLNonNull(types.GraphQLInt),
    collaborator_invite_count: new types.GraphQLNonNull(types.GraphQLInt),
    collection_limit: new types.GraphQLNonNull(types.GraphQLInt),
    collection_count: new types.GraphQLNonNull(types.GraphQLInt),
    api_call_limit: new types.GraphQLNonNull(types.GraphQLInt),
    api_call_count: new types.GraphQLNonNull(types.GraphQLInt),
    available_features: new types.GraphQLList(types.GraphQLString),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    organization: requireType('Organization'),
  }
}));

module.exports = planType;
