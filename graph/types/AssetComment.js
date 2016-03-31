import * as types from './standard';

import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';

const assetCommentType = new ApiResourceType('AssetComment', () => ({
  attributes: {
    body: new types.GraphQLNonNull(types.GraphQLString),
    mention_meta: new types.GraphQLNonNull(types.GraphQLReusableObject),
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
