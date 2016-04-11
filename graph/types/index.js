import requireType from '../helpers/requireType';
import { nodeField } from '../interfaces/node';
import { slugField } from '../interfaces/slug';
import { GraphQLObjectType } from './standard';

let queryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The query root of the schema',
  fields: () => ({
    ...requireType('User').instanceFieldAs('viewer', { apiId: 'current' }),
    apiIndex: {
      type: requireType('ApiIndex').type,
      resolve: () => ({})
    },
    ...requireType('AccessRequest').instanceField,
    ...requireType('Asset').instanceField,
    ...requireType('AssetApproval').instanceField,
    ...requireType('AssetComment').instanceField,
    ...requireType('Attachment').instanceField,
    ...requireType('Brandfolder').instanceField,
    ...requireType('Collection').instanceField,
    ...requireType('CollectionSection').instanceField,
    ...requireType('Brandfolder').instanceField,
    ...requireType('Invitation').instanceField,
    ...requireType('Organization').instanceField,
    ...requireType('Plan').instanceField,
    ...requireType('Section').instanceField,
    ...requireType('Session').instanceField,
    ...requireType('SocialLink').instanceField,
    ...requireType('User').instanceField,
    ...requireType('UserPermission').instanceField,

    node: nodeField,
    slug: slugField
  })
});

export default queryType;
