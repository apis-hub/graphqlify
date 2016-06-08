import * as types from './standard';

import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';

// import _ from 'lodash';
// import { getFieldNamesFromResolveInfo } from '../helpers/contextHelpers';

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
  },
  // TODO: Improve performance for comments, needs client update
  // beforeRequest: (parent, args, __ignored, resolveInfo) => {
  //   const fields = getFieldNamesFromResolveInfo(
  //     resolveInfo, [ 'comments', 'edges', 'node' ]
  //   );
  //
  //   // Include replies in the request
  //   if (fields.find(name => name === 'replies')) {
  //     const repliesFields = getFieldNamesFromResolveInfo(
  //       resolveInfo, [ 'comments', 'edges', 'node', 'replies', 'edges', 'node' ]
  //     );
  //     // Include reply authors in the request
  //     const replyInclude = repliesFields.find(name => name === 'author') ?
  //       'replies.author' : 'replies';
  //     args.include = _.compact([ args.include, replyInclude ]).join(',');
  //   }
  //   // Include authors in the request
  //   if (fields.find(name => name === 'author')) {
  //     args.include = _.compact([ args.include, 'author' ]).join(',');
  //   }
  // }
}));

module.exports = assetCommentType;
