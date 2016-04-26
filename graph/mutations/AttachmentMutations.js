import * as types from '../types/standard';

import RootResourceMutator from '../builders/RootResourceMutator';

const { updateAttachment } = new RootResourceMutator(() => ({
  name: 'Attachment',
  type: () => require('../types/Attachment'),
  attributes: () => ({
    position: types.GraphQLInt
  })
}));

export { updateAttachment };
