import * as types from './standard';

import ParamsType from '../builders/ParamsType';

export const type = new ParamsType('AttachmentFilter', {
  description: 'The params for the search.',
  fields: {
    mimetype: types.GraphQLString
  }
});
