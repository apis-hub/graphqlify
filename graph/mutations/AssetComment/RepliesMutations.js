import RelatedResourceMutator from '../../helpers/RelatedResourceMutator';
import * as types from '../../types/standard';

const { createAssetCommentsReply } = new RelatedResourceMutator(() => ({
  type: () => require('../../types/AssetComment'),
  parentType: () => require('../../types/AssetComment'),
  relationship: 'replies',
  attributes: () => ({
    body: new types.GraphQLNonNull(types.GraphQLString)
  })
}));

export { createAssetCommentsReply };
