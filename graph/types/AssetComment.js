import ApiResourceType from '../helpers/ApiResourceType';
import * as types from './standard';

const assetCommentType = new ApiResourceType('AssetComment', () => ({
  attributes: {
    body: new types.GraphQLNonNull(types.GraphQLString),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    asset: require('./Asset'),
    author: require('./User')
  },
  relatesToMany: {
    replies: assetCommentType,
  }
}));

module.exports = assetCommentType;
