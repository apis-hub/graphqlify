import ApiResourceType from '../builders/ApiResourceType';
import requireType from '../helpers/requireType';
import * as types from './standard';

const searchFilterType = new ApiResourceType('SearchFilter', () => ({
  attributes: {
    query: new types.GraphQLNonNull(types.GraphQLString),
    position: new types.GraphQLNonNull(types.GraphQLInt),
    label: new types.GraphQLNonNull(types.GraphQLString),
    assets: types.GraphQLList

  },
  relatesToOne: {
    brandfolder: requireType('Brandfolder')
  }
}));

module.exports = searchFilterType;
