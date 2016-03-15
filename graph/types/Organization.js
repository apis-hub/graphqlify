import { slugInterface } from '../interfaces/slug';
import ApiResourceType from '../helpers/ApiResourceType';
import * as types from './standard';

const organizationType = new ApiResourceType('Organization', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    slug: new types.GraphQLNonNull(types.GraphQLString),
    branded_login_image: types.GraphQLString,
    plan_name: types.GraphQLString,
    feature_names: new types.GraphQLList(types.GraphQLString),
    number_of_brandfolders: new types.GraphQLNonNull(types.GraphQLInt),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    plan: require('./Plan'),
  },
  relatesToMany: {
    brandfolders: require('./Brandfolder'),
    collections: require('./Collection'),
    assets: require('./Asset'),
    owners: require('./User'),
    user_permissions: require('./UserPermission'),
    // ...require('./concerns/permissibleRelationships')
  }
}), slugInterface);

module.exports = organizationType;
