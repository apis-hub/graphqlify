import * as types from './standard';

import ApiResourceType from '../builders/ApiResourceType';

const webFontType = new ApiResourceType('WebFont', () => {
  return {
    attributes: {
      name: types.GraphQLString,
      option: types.GraphQLString,
    }
  };
});

module.exports = webFontType;
