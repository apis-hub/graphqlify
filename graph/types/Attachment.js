import * as types from './standard';

import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';

const attachmentType = new ApiResourceType('Attachment', () => ({
  attributes: {
    file_url: new types.GraphQLNonNull(types.GraphQLString),
    mimetype: types.GraphQLString,
    extension: types.GraphQLString,
    filename: types.GraphQLString,
    size: types.GraphQLInt,
    thumbnail_url: types.GraphQLString,
    preview_url: types.GraphQLString,
    thumbnailed: types.GraphQLBoolean,
    width: types.GraphQLInt,
    height: types.GraphQLInt,
    conversion_options: new types.GraphQLList(types.GraphQLString),
    position: types.GraphQLInt
  },
  relatesToOne: {
    asset: requireType('Asset'),
    creator: requireType('User')
  },
  connectionArgs: {
    filter: {
      type: requireType('AttachmentFilterParams').type
    },
    search: {
      type: requireType('SearchParams').type
    }
  }
}));

module.exports = attachmentType;
