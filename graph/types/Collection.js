import * as types from './standard';

import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';
import { iface as permissibleInterface } from '../interfaces/Permissible';
import { slugInterface } from '../interfaces/slug';

const collectionType = new ApiResourceType('Collection', () => ({
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
    zip_download_url: new types.GraphQLNonNull(types.GraphQLString),
    ...require('./concerns/rolePermissions'),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    organization: requireType('Organization'),
    brandfolder: requireType('Brandfolder'),
    plan: requireType('Plan'),
    bulk_selection: requireType('BulkSelection')
  },
  relatesToMany: {
    sections: requireType('CollectionSection'),
    assets: requireType('Asset'),
    ...require('./concerns/permissibleRelationships')()
  },
  fields: {
    access_requests: requireType('AccessRequest').connectionStub,
    can_own: {
      type: new types.GraphQLNonNull(types.GraphQLBoolean),
      resolve: () => false
    }
  }
}), slugInterface, permissibleInterface);

module.exports = collectionType;
