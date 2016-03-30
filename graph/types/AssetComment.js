import ApiResourceType from '../builders/ApiResourceType';
import requireType from '../helpers/requireType';
import * as types from './standard';

const assetCommentType = new ApiResourceType('AssetComment', () => ({
  attributes: {
    body: new types.GraphQLNonNull(types.GraphQLString),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    asset: requireType('Asset'),
    author: requireType('User')
  },
  relatesToMany: {
    replies: assetCommentType,
  }
}));

module.exports = assetCommentType;
