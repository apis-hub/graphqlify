import RelatedResourceMutator from '../../builders/RelatedResourceMutator';
import * as types from '../../types/standard';

const { createAssetCommentsReply, deleteAssetCommentsReply } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/AssetComment'),
    parentType: () => require('../../types/AssetComment'),
    relationship: 'replies',
    attributes: () => ({
      body: new types.GraphQLNonNull(types.GraphQLString)
    })
  }));

export { createAssetCommentsReply, deleteAssetCommentsReply };
