import * as types from '../types/standard';

import requireMutations from '../helpers/requireMutations';
import RootResourceMutator from '../builders/RootResourceMutator';

const { updateAssetComment } = new RootResourceMutator(() => ({
  type: () => require('../types/AssetComment'),
  attributes: () => ({
    body: types.GraphQLString,
  })
}));

module.exports = {
  updateAssetComment,
  ...requireMutations('AssetComment/RepliesMutations')
};
