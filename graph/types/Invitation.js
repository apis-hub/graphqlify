import { buildResourceType } from '../typeHelpers';
import * as types from '../GraphQLTypes';

const { type, connectionType, edgeType } = buildResourceType('Invitation', () => ({
  attributes: {
    first_name: types.GraphQLString,
    last_name: types.GraphQLString,
    email: new types.GraphQLNonNull(types.GraphQLString),
    permission_level: new types.GraphQLNonNull(types.GraphQLString),
    personal_message: types.GraphQLString,
    active: types.GraphQLBoolean,
    token: new types.GraphQLNonNull(types.GraphQLString),
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    inviter: require('./User').type
  }
}));

export { type, connectionType, edgeType };
