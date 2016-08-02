import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { createOrganizationsAdobeIntegration, deleteOrganizationsAdobeIntegration } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/AdobeIntegration'),
    parentType: () => require('../../types/Organization'),
    relationship: 'adobe_integrations',
    createRelatesToOne: [ 'user' ]
  }));

export { createOrganizationsAdobeIntegration, deleteOrganizationsAdobeIntegration };
