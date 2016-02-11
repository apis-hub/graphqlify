import { buildResourceType } from "../typeHelpers"
import * as types from "../GraphQLTypes";

const {type, connectionType, edgeType} = buildResourceType('Asset', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    asset_type: new types.GraphQLNonNull(types.GraphQLString),
    thumbnail_url: types.GraphQLString,
    preview_url: types.GraphQLString,
    description: types.GraphQLString,
    asset_data: types.GraphQLReusableObject,
    approved: types.GraphQLBoolean,
    tag_names: new types.GraphQLList(types.GraphQLString),
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    brandfolder: require('./Brandfolder').type,
  },
  relatesToMany: {
    attachments: require('./Attachment').connectionType,
    collections: require('./Collection').connectionType,
    comments: require('./AssetComment').connectionType
  }
}))

export { type, connectionType, edgeType };
