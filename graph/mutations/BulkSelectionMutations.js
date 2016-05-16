import * as types from '../types/standard';
import RootResourceMutator from '../builders/RootResourceMutator';

const { updateBulkSelection } = new RootResourceMutator(() => ({
  name: 'BulkSelection',
  type: () => require('../types/BulkSelection'),
  updateAttributes: () => ({
    clicked_asset_key: types.GraphQLString,
    shift_selected: types.GraphQLBoolean,
    select_all: types.GraphQLBoolean,
    deselect_all: types.GraphQLBoolean,
    resource_key: types.GraphQLString,
    resource_type: types.GraphQLString
  })
}));

export { updateBulkSelection };
