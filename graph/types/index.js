import requireType from '../helpers/requireType';
import { nodeField } from '../interfaces/node';
import { slugField } from '../interfaces/slug';
import { GraphQLObjectType } from './standard';

let queryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The query root of the schema',
  fields: () => ({
    apiIndex: {
      type: requireType('ApiIndex').type,
      resolve: () => ({})
    },
    ...requireType('User').instanceFieldAs('viewer', { apiId: 'current' }),
    ...requireType('AccessRequest').instanceField,
    ...requireType('AdobeIntegration').instanceField,
    ...requireType('Asset').instanceField,
    ...requireType('AssetApproval').instanceField,
    ...requireType('AssetComment').instanceField,
    ...requireType('Attachment').instanceField,
    ...requireType('Brandfolder').instanceField,
    ...requireType('BulkSelection').instanceField,
    ...requireType('Collection').instanceField,
    ...requireType('CollectionSection').instanceField,
    ...requireType('Invitation').instanceField,
    ...requireType('InvitationToken').instanceField,
    ...requireType('Organization').instanceField,
    ...requireType('Plan').instanceField,
    ...requireType('SearchFilter').instanceField,
    ...requireType('SearchFilterSection').instanceField,
    ...requireType('Section').instanceField,
    ...requireType('Session').instanceField,
    ...requireType('SocialLink').instanceField,
    ...requireType('User').instanceField,
    ...requireType('UserPermission').instanceField,
    ...requireType('WebFont').instanceField,
    node: nodeField,
    slug: slugField
  })
});

export default queryType;
