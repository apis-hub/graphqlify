import * as types from '../types/standard';

import requireMutations from '../helpers/requireMutations';
import RootResourceMutator from '../builders/RootResourceMutator';

const { updateAsset } = new RootResourceMutator(() => ({
  type: () => require('../types/Asset'),
  attributes: () => ({
    name: types.GraphQLString,
    description: types.GraphQLString,
    asset_data: types.GraphQLReusableObject,
    custom_fields: types.GraphQLReusableObject,
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
