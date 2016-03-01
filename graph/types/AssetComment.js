import { buildResourceType } from '../typeHelpers';
import * as types from '../GraphQLTypes';

const { type, connectionType, edgeType } = buildResourceType('AssetComment', () => ({
  attributes: {
    body: new types.GraphQLNonNull(types.GraphQLString),
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    asset: require('./Asset').type,
    author: require('./User').type
  },
  relatesToMany: {
    replies: connectionType,
  }
}));

export { type, connectionType, edgeType };
