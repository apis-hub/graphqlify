import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';

const bulkSelectionType = new ApiResourceType('BulkSelection', () => ({
  relatesToMany: {
    selected_assets: requireType('Asset')
  }
}));

module.exports = bulkSelectionType;
