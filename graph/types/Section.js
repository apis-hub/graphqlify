import buildResourceType from '../helpers/buildResourceType';
import * as types from './standard';

const sectionType = buildResourceType('Section', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    default_asset_type: new types.GraphQLNonNull(types.GraphQLString),
    number_of_assets: new types.GraphQLNonNull(types.GraphQLInt),
    position: new types.GraphQLNonNull(types.GraphQLInt),
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    brandfolder: require('./Brandfolder').type
  },
  relatesToMany: {
    assets: require('./Asset').connectionType,
  }
}));

module.exports = sectionType;
