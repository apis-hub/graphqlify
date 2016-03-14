import RootResourceMutator from '../helpers/RootResourceMutator';
import * as types from '../types/standard';

const { deleteAssetApproval } = new RootResourceMutator(() => ({
  type: () => require('../types/AssetApproval'),
  attributes: () => ({
    body: new types.GraphQLNonNull(types.GraphQLString),
  })
}));

module.exports = {
  deleteAssetApproval
};
