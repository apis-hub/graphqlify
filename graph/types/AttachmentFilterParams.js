import * as types from './standard';

import ParamsType from './ParamsType';

export const type = new ParamsType('AttachmentFilter', {
  description: 'The params for filtering attachment.',
  fields: {
    mimetype: types.GraphQLString
  }
});
