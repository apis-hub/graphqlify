import RelatedResourceMutator from '../../builders/RelatedResourceMutator';
import * as types from '../../types/standard';

const { createAssetsComment, deleteAssetsComment } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/AssetComment'),
    parentType: () => require('../../types/Asset'),
    relationship: 'comments',
    attributes: () => ({
      body: new types.GraphQLNonNull(types.GraphQLString)
    })
  }));

export { createAssetsComment, deleteAssetsComment };
