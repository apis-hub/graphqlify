import RootResourceMutator from '../helpers/RootResourceMutator';
import * as types from '../types/standard';
import requireMutations from '../helpers/requireMutations';

const { updateSection, deleteSection } = new RootResourceMutator(() => ({
  name: 'Section',
  type: () => require('../types/Section'),
  attributes: () => ({
    name: types.GraphQLString
  })
}));

module.exports = {
  updateSection,
  deleteSection,
  ...requireMutations('Section/AssetsMutations')
};
