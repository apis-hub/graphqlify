import * as types from '../types/standard';

import requireInterface from '../helpers/requireInterface';
import requireType from '../helpers/requireType';
import ApiInterfaceType from '../builders/ApiInterfaceType';

module.exports = new ApiInterfaceType('Sectionable', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    default_asset_type: new types.GraphQLNonNull(types.GraphQLString),
    number_of_assets: new types.GraphQLNonNull(types.GraphQLInt),
    position: new types.GraphQLNonNull(types.GraphQLInt),
    zip_download_url: new types.GraphQLNonNull(types.GraphQLString),
    ...require('../types/concerns/timestamps')
  },
  relatesToOne: {
    brandfolder: requireType('Brandfolder')
  },
  relatesToMany: {
    assets: requireType('Asset'),
  },
  connectionArgs: {
    has_assets: types.GraphQLBoolean
  }
}));
