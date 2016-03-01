import { slugInterface } from '../interfaces/slug';
import { connectionType as userConnectionType } from './User';
import { buildResourceType } from '../typeHelpers';
import * as types from '../GraphQLTypes';

const { type, connectionType, edgeType } = buildResourceType('Organization', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    slug: new types.GraphQLNonNull(types.GraphQLString),
    branded_login_image: types.GraphQLString,
    feature_names: new types.GraphQLList(types.GraphQLString),
    number_of_brandfolders: new types.GraphQLNonNull(types.GraphQLInt),
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    plan: require('./Plan').type,
  },
  relatesToMany: {
    brandfolders: require('./Brandfolder').connectionType,
    collections: require('./Collection').connectionType,
    assets: require('./Asset').connectionType,
    user_permissions: require('./UserPermission').connectionType,
    users: userConnectionType,
    owners: userConnectionType,
    admins: userConnectionType,
    collaborators: userConnectionType,
    guests: userConnectionType
  }
}), slugInterface);

export { type, connectionType, edgeType };
