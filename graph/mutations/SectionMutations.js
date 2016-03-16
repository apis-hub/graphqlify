import RootResourceMutator from '../helpers/RootResourceMutator';
import * as types from '../types/standard';
import requireMutations from '../helpers/requireMutations';

const { updateSection } = new RootResourceMutator(() => ({
  name: 'Section',
  type: () => require('../types/Section'),
  attributes: () => ({
    name: new types.GraphQLNonNull(types.GraphQLString),
    position: new types.GraphQLNonNull(types.GraphQLInt)
  })
}));

module.exports = {
  updateSection,
  ...requireMutations('Section/AssetsMutations')
};
