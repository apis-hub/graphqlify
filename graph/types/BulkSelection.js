import ApiResourceType from '../builders/ApiResourceType';
import requireType from '../helpers/requireType';
import * as types from './standard';

const bulkSelectionType = new ApiResourceType('BulkSelection', () => ({
  relatesToMany: {
    selected_assets: requireType('Asset')
  }
}));

module.exports = bulkSelectionType;
