import ApiResourceType from '../helpers/ApiResourceType';
import * as types from './standard';

const assetType = new ApiResourceType('Asset', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    asset_type: new types.GraphQLNonNull(types.GraphQLString),
    thumbnail_url: types.GraphQLString,
    preview_url: types.GraphQLString,
    description: types.GraphQLString,
    asset_data: types.GraphQLReusableObject,
    custom_fields: types.GraphQLReusableObject,
    approved: types.GraphQLBoolean,
    tag_names: new types.GraphQLList(types.GraphQLString),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    brandfolder: require('./Brandfolder'),
  },
  relatesToMany: {
    attachments: require('./Attachment'),
    collections: require('./Collection'),
    comments: require('./AssetComment'),
    appovals: require('./AssetApproval')
  }
}));

module.exports = assetType;
