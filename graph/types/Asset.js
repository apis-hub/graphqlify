import * as types from './standard';

import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';
import ImageDataType from './ImageData';

const assetType = new ApiResourceType('Asset', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    position: types.GraphQLInt,
    asset_type: new types.GraphQLNonNull(types.GraphQLString),
    thumbnail_url: ImageDataType,
    preview_url: ImageDataType,
    description: types.GraphQLString,
    asset_data: new types.GraphQLNonNull(types.GraphQLReusableObject),
    custom_fields: new types.GraphQLNonNull(types.GraphQLReusableObject),
    approved: new types.GraphQLNonNull(types.GraphQLBoolean),
    tag_names: new types.GraphQLList(types.GraphQLString),
    zip_download_url: new types.GraphQLNonNull(types.GraphQLString),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    brandfolder: requireType('Brandfolder'),
  },
  relatesToMany: {
    attachments: requireType('Attachment'),
    collections: requireType('Collection'),
    comments: requireType('AssetComment'),
    appovals: requireType('AssetApproval')
  },
  connectionArgs: {
    search: {
      type: requireType('SearchParams').type
    }
  }
}));

module.exports = assetType;
