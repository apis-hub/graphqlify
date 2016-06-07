import * as types from './standard';

import ApiResourceType from '../builders/ApiResourceType';
import requireType from '../helpers/requireType';

const searchFilterType = new ApiResourceType('SearchFilter', () => ({
  attributes: {
    query: new types.GraphQLNonNull(types.GraphQLString),
    position: new types.GraphQLNonNull(types.GraphQLInt),
    label: new types.GraphQLNonNull(types.GraphQLString),
    zip_download_url: new types.GraphQLNonNull(types.GraphQLString),
  },
  relatesToOne: {
    brandfolder: requireType('Brandfolder'),
    bulk_selection: requireType('BulkSelection')
  },
  relatesToMany: {
    assets: requireType('Asset'),
    sections: requireType('SearchFilterSection'),
  }
}));

module.exports = searchFilterType;
