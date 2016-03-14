import RelatedResourceMutator from '../../helpers/RelatedResourceMutator';
import * as types from '../../types/standard';

const { createAssetsAttachment } = new RelatedResourceMutator(() => ({
  type: () => require('../../types/Attachment'),
  parentType: () => require('../../types/Asset'),
  relationship: 'attachments',
  attributes: () => ({
    url: new types.GraphQLNonNull(types.GraphQLString)
  })
}));

export { createAssetsAttachment };
