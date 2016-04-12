import ApiResourceType from '../builders/ApiResourceType';
import requireType from '../helpers/requireType';
import * as types from './standard';

const searchFilterType = new ApiResourceType('SearchFilter', () => ({
  attributes: {
    query: new types.GraphQLNonNull(types.GraphQLString),
    position: new types.GraphQLNonNull(types.GraphQLInt),
    label: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    brandfolder: requireType('Brandfolder')
  },
  relatesToMany: {
    assets: requireType('Asset')
  }
}));

module.exports = searchFilterType;
