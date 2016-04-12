import * as types from '../types/standard';

import requireMutations from '../helpers/requireMutations';
import RootResourceMutator from '../builders/RootResourceMutator';

const { updateSection } = new RootResourceMutator(() => ({
  name: 'Section',
  type: () => require('../types/Section'),
  attributes: () => ({
    name: types.GraphQLString,
    position: types.GraphQLInt
  })
}));

module.exports = {
  updateSection,
  ...requireMutations('Section/AssetsMutations')
};
