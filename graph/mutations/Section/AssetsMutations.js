import * as types from '../../types/standard';

import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { createSectionsAsset, addSectionsAssets, removeSectionsAssets } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/Asset'),
    parentType: () => require('../../types/Section'),
    relationship: 'assets',
    createAttributes: () => ({
      name: new types.GraphQLNonNull(types.GraphQLString),
      description: new types.GraphQLNonNull(types.GraphQLString),
      asset_data: types.GraphQLReusableObject,
      custom_fields: types.GraphQLReusableObject,
      approved: types.GraphQLBoolean
    }),
  }));

export { createSectionsAsset, addSectionsAssets, removeSectionsAssets };
