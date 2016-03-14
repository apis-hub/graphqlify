import ApiResourceType from '../helpers/ApiResourceType';

const assetApprovalType = new ApiResourceType('AssetApproval', () => ({
  attributes: {
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    asset: require('./Asset'),
    user: require('./User')
  }
}));

module.exports = assetApprovalType;
