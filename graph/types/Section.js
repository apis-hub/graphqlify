import ApiResourceType from '../helpers/ApiResourceType';
import * as types from './standard';

const sectionType = new ApiResourceType('Section', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    default_asset_type: new types.GraphQLNonNull(types.GraphQLString),
    number_of_assets: new types.GraphQLNonNull(types.GraphQLInt),
    position: new types.GraphQLNonNull(types.GraphQLInt),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    brandfolder: require('./Brandfolder')
  },
  relatesToMany: {
    assets: require('./Asset'),
  },
  connectionArgs: {
    has_assets: types.GraphQLBoolean
  }
}));

module.exports = sectionType;
