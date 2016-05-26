import * as types from '../../types/standard';

import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { createSectionsAsset, addSectionsAssets, removeSectionsAssets } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/Asset'),
    parentType: () => require('../../types/Section'),
    relationship: 'assets',
    createAttributes: () => ({
      name: new types.GraphQLNonNull(types.GraphQLString),
      description: types.GraphQLString,
      asset_data: types.GraphQLReusableObject,
      new_custom_fields: new types.GraphQLList(types.GraphQLReusableObject),
      tag_names: new types.GraphQLList(types.GraphQLString),
      approved: types.GraphQLBoolean
    }),
  }));

export { createSectionsAsset, addSectionsAssets, removeSectionsAssets };
