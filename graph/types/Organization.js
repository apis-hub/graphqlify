import * as types from './standard';

import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';
import { permissibleInterface } from '../interfaces/permissible';
import { slugInterface } from '../interfaces/slug';

const organizationType = new ApiResourceType('Organization', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    slug: new types.GraphQLNonNull(types.GraphQLString),
    branded_login_image: types.GraphQLString,
    plan_name: types.GraphQLString,
    feature_names: new types.GraphQLList(types.GraphQLString),
    number_of_brandfolders: new types.GraphQLNonNull(types.GraphQLInt),
    can_own: new types.GraphQLNonNull(types.GraphQLBoolean),
    zip_download_url: new types.GraphQLNonNull(types.GraphQLString),
    ...require('./concerns/rolePermissions'),
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
    all_users: requireType('User'),
    licensed_users: requireType('User'),
    adobe_integrations: requireType('AdobeIntegration'),
    ...require('./concerns/permissibleRelationships')()
  },
  fields: {
    access_requests: requireType('AccessRequest').connectionStub
  }
}), slugInterface, permissibleInterface);

module.exports = organizationType;
