import * as types from './standard';

import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';

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
    brandfolder: requireType('Brandfolder'),
  },
  relatesToMany: {
    attachments: requireType('Attachment'),
    collections: requireType('Collection'),
    comments: requireType('AssetComment'),
    appovals: requireType('AssetApproval')
  },
  beforeRequest: (parent, args) => {
    let type = (((parent || {}).collection || {}).parent || {}).type;
    if (type === 'collections') {
      args.filter = { collection: parent.collection.parent.id };
    }
  }
}));

module.exports = assetType;
