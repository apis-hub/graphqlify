import * as types from '../types/standard';
import RootResourceMutator from '../builders/RootResourceMutator';

const { updateBulkSelection } = new RootResourceMutator(() => ({
  name: 'BulkSelection',
  type: () => require('../types/BulkSelection'),
  updateAttributes: () => ({
    clicked_asset_key: types.GraphQLString,
    shift_selected: types.GraphQLBoolean
  })
}));

export { updateBulkSelection };
