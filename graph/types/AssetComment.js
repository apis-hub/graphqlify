import buildResourceType from '../helpers/buildResourceType';
import * as types from './standard';

const assetCommentType = buildResourceType('AssetComment', () => ({
  attributes: {
    body: new types.GraphQLNonNull(types.GraphQLString),
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    asset: require('./Asset').type,
    author: require('./User').type
  },
  relatesToMany: {
    replies: assetCommentType.connectionType,
  }
}));

module.exports = assetCommentType;
