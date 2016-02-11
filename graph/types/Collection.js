import { slugInterface } from "../interfaces/slug";
import { connectionType as userConnectionType } from "./User"
import { buildResourceType } from "../typeHelpers"
import * as types from "../GraphQLTypes";

const {type, connectionType, edgeType} = buildResourceType('Collection', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    slug: new types.GraphQLNonNull(types.GraphQLString),
    public: new types.GraphQLNonNull(types.GraphQLBoolean),
    private: new types.GraphQLNonNull(types.GraphQLBoolean),
    stealth: new types.GraphQLNonNull(types.GraphQLBoolean),
    header_image: types.GraphQLString,
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    organization: require('./Organization').type,
    brandfolder: require('./Brandfolder').type
  },
  relatesToMany: {
    assets: require('./Asset').connectionType,
    collections: require('./Collection').connectionType,
    user_permissions: require('./UserPermission').connectionType,
    users: userConnectionType,
    admins: userConnectionType,
    collaborators: userConnectionType,
    guests: userConnectionType
  }
}), slugInterface);

export { type, connectionType, edgeType };
