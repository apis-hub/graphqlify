import { buildResourceType } from '../typeHelpers';
import * as types from '../GraphQLTypes';

const { type, connectionType, edgeType } = buildResourceType('Attachment', () => ({
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
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    asset: require('./Asset').type,
    creator: require('./User').type
  }
}));

export { type, connectionType, edgeType };
