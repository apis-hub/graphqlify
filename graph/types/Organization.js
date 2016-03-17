import { slugInterface } from '../interfaces/slug';
import { permissibleInterface } from '../interfaces/permissible';
import ApiResourceType from '../builders/ApiResourceType';
import * as types from './standard';
import requireType from '../helpers/requireType';

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
    plan: requireType('Plan'),
  },
  relatesToMany: {
    brandfolders: requireType('Brandfolder'),
    collections: requireType('Collection'),
    assets: requireType('Asset'),
    owners: requireType('User'),
    ...require('./concerns/permissibleRelationships')()
  },
  fields: {
    access_requests: requireType('AccessRequest').connectionStub
  }
}), slugInterface, permissibleInterface);

module.exports = organizationType;
