import * as types from './standard';

import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';

const sectionType = new ApiResourceType('SearchFilterSection', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    default_asset_type: new types.GraphQLNonNull(types.GraphQLString),
    number_of_assets: new types.GraphQLNonNull(types.GraphQLInt),
    position: new types.GraphQLNonNull(types.GraphQLInt),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    brandfolder: requireType('Brandfolder'),
    search_filter: requireType('SearchFilter')
  },
  relatesToMany: {
    assets: requireType('Asset'),
  },
  connectionArgs: {
    has_assets: types.GraphQLBoolean
  }
}));

module.exports = sectionType;