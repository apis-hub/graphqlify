import ApiResourceType from '../helpers/ApiResourceType';
import * as types from './standard';

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
    metadata: types.GraphQLReusableObject,
  },
  relatesToOne: {
    asset: require('./Asset'),
    creator: require('./User')
  }
}));

module.exports = attachmentType;
