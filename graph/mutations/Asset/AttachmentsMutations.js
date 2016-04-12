import * as types from '../../types/standard';

import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { createAssetsAttachment, deleteAssetsAttachment } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/Attachment'),
    parentType: () => require('../../types/Asset'),
    relationship: 'attachments',
    createAttributes: () => ({
      url: new types.GraphQLNonNull(types.GraphQLString)
    })
  }));

export { createAssetsAttachment, deleteAssetsAttachment };
