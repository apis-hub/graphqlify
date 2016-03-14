import RootResourceMutator from '../helpers/RootResourceMutator';
import * as types from '../types/standard';
import requireMutations from '../helpers/requireMutations';

const { updateAsset } = new RootResourceMutator(() => ({
  type: () => require('../types/Asset'),
  attributes: () => ({
    name: new types.GraphQLNonNull(types.GraphQLString),
    description: types.GraphQLString,
    asset_data: types.GraphQLReusableObject,
    custom_fields: types.GraphQLReusableObject,
    approved: types.GraphQLBoolean
  })
}));

module.exports = {
  updateAsset,
  ...requireMutations('Asset/ApprovalsMutations'),
  ...requireMutations('Asset/AttachmentsMutations'),
  ...requireMutations('Asset/CommentsMutations')
};
