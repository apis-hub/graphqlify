import * as types from './standard';

import ParamsType from './ParamsType';

export const type = new ParamsType('Search', {
  description: 'The params for the search.',
  fields: {
    query: types.GraphQLString
  }
});
