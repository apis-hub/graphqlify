import ApiResourceType from '../builders/ApiResourceType';
import requireType from '../helpers/requireType';

const assetApprovalType = new ApiResourceType('AssetApproval', () => ({
  attributes: {
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    asset: requireType('Asset'),
    user: requireType('User')
  }
}));

module.exports = assetApprovalType;
