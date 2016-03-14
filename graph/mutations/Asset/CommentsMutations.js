import RelatedResourceMutator from '../../helpers/RelatedResourceMutator';
import * as types from '../../types/standard';

const { createAssetsComment } = new RelatedResourceMutator(() => ({
  type: () => require('../../types/AssetComment'),
  parentType: () => require('../../types/Asset'),
  relationship: 'comments',
  attributes: () => ({
    body: new types.GraphQLNonNull(types.GraphQLString)
  })
}));

export { createAssetsComment };
