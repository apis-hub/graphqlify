import ApiResourceType from '../builders/ApiResourceType';
import requireType from '../helpers/requireType';

const adobeIntegrationType = new ApiResourceType('AdobeIntegration', () => ({
  attributes: {
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    user: requireType('User'),
    organization: requireType('Organization')
  }
}));

module.exports = adobeIntegrationType;
