import RootResourceMutator from '../helpers/RootResourceMutator';
import * as types from '../types/standard';
import requireMutations from '../helpers/requireMutations';

const { updateAssetComment, deleteAssetComment } = new RootResourceMutator(() => ({
  type: () => require('../types/AssetComment'),
  attributes: () => ({
    body: new types.GraphQLNonNull(types.GraphQLString),
  })
}));

module.exports = {
  updateAssetComment,
  deleteAssetComment,
  ...requireMutations('AssetComment/RepliesMutations')
};
