import { GraphQLObjectType } from 'graphql';

import fetchTypeById from '../helpers/fetchTypeById';
import requireType from '../helpers/requireType';
import { apiResourceField } from '../interfaces/apiResource';
import { nodeField } from '../interfaces/node';
import { slugField } from '../interfaces/slug';

let queryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The query root of the schema',
  fields: () => ({
    api: {
      type: requireType('Api').type,
      resolve: context => context.api
    },
    viewer: {
      type: requireType('User').type,
      resolve: (rootValue, args, context) => fetchTypeById(
        'users', 'current', context, {}, 'viewer'
      )
    },
    apiResource: apiResourceField,
    node: nodeField,
    slug: slugField
  })
});

export default queryType;
