import * as types from '../../types/standard';

import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { createAssetsComment, deleteAssetsComment } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/AssetComment'),
    parentType: () => require('../../types/Asset'),
    relationship: 'comments',
    createAttributes: () => ({
      body: new types.GraphQLNonNull(types.GraphQLString)
    })
  }));

export { createAssetsComment, deleteAssetsComment };
