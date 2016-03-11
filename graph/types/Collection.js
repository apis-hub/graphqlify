import { slugInterface } from '../interfaces/slug';
import { connectionType as userConnectionType } from './User';
import buildResourceType from '../helpers/buildResourceType';
import * as types from './standard';

const collectionType = buildResourceType('Collection', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    slug: new types.GraphQLNonNull(types.GraphQLString),
    public: new types.GraphQLNonNull(types.GraphQLBoolean),
    private: new types.GraphQLNonNull(types.GraphQLBoolean),
    stealth: new types.GraphQLNonNull(types.GraphQLBoolean),
    header_image: types.GraphQLString,
    feature_names: new types.GraphQLList(types.GraphQLString),
    number_of_assets: new types.GraphQLNonNull(types.GraphQLInt),
    number_of_sections: new types.GraphQLNonNull(types.GraphQLInt),
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    organization: require('./Organization').type,
    brandfolder: require('./Brandfolder').type
  },
  relatesToMany: {
    sections: require('./Section').connectionType,
    assets: require('./Asset').connectionType,
    collections: require('./Collection').connectionType,
    user_permissions: require('./UserPermission').connectionType,
    users: userConnectionType,
    admins: userConnectionType,
    collaborators: userConnectionType,
    guests: userConnectionType
  }
}), slugInterface);

module.exports = collectionType;
