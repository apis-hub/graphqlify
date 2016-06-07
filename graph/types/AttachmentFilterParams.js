import * as types from './standard';

import ParamsType from '../builders/ParamsType';

export const type = new ParamsType('Search', {
  description: 'The params for the search.',
  fields: {
    mimetype: types.GraphQLString
  }
});
