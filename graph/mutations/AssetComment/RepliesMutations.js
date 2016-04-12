import * as types from '../../types/standard';

import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { createAssetCommentsReply, deleteAssetCommentsReply } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/AssetComment'),
    parentType: () => require('../../types/AssetComment'),
    relationship: 'replies',
    createAttributes: () => ({
      body: new types.GraphQLNonNull(types.GraphQLString)
    })
  }));

export { createAssetCommentsReply, deleteAssetCommentsReply };
