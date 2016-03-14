import RelatedResourceMutator from '../../helpers/RelatedResourceMutator';
import * as types from '../../types/standard';

const { createSectionsAsset, addSectionsAssets, removeSectionsAssets } = new RelatedResourceMutator(() => ({
  type: () => require('../../types/Asset'),
  parentType: () => require('../../types/Section'),
  relationship: 'assets',
  attributes: () => ({
    name: new types.GraphQLNonNull(types.GraphQLString),
    description: types.GraphQLString,
    asset_data: types.GraphQLReusableObject,
    custom_fields: types.GraphQLReusableObject,
    approved: types.GraphQLBoolean
  })
}));

export { createSectionsAsset, addSectionsAssets, removeSectionsAssets };
