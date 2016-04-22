import * as types from '../types/standard';

import requireMutations from '../helpers/requireMutations';
import RootResourceMutator from '../builders/RootResourceMutator';

const { updateAsset } = new RootResourceMutator(() => ({
  type: () => require('../types/Asset'),
  attributes: () => ({
    name: types.GraphQLString,
    position: types.GraphQLInt,
    description: types.GraphQLString,
    asset_data: types.GraphQLReusableObject,
    new_custom_fields: new types.GraphQLList(types.GraphQLReusableObject),
    tag_names: new types.GraphQLList(types.GraphQLString),
    approved: types.GraphQLBoolean
  })
}));

module.exports = {
  updateAsset,
  ...requireMutations('Asset/ApprovalsMutations'),
  ...requireMutations('Asset/AttachmentsMutations'),
  ...requireMutations('Asset/CommentsMutations')
};
