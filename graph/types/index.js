import { nodeField } from '../interfaces/node';
import { slugField } from '../interfaces/slug';
import { apiResourceField } from '../interfaces/apiResource';
import requireType from '../helpers/requireType';
import { GraphQLObjectType } from 'graphql';

let queryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The query root of the schema',
  fields: () => ({
    api: {
      type: requireType('Api').type,
      resolve: context => context.api
    },
    viewer: {
      type: requireType('Viewer').type,
      resolve: () => ({})
    },
    apiResource: apiResourceField,
    node: nodeField,
    slug: slugField
  })
});

export default queryType;
