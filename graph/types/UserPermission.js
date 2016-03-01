import { buildResourceType } from '../typeHelpers';
import * as types from '../GraphQLTypes';

const { type, connectionType, edgeType } = buildResourceType('UserPermission', () => ({
  attributes: {
    permission_level: new types.GraphQLNonNull(types.GraphQLString),
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    user: require('./User').type
  }
}));

export { type, connectionType, edgeType };
