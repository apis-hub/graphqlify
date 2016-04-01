import requireType from '../helpers/requireType';
import ParamsType from '../builders/ParamsType';
import { connectionFromIndex } from '../helpers/connectionHelpers';
import { apiResourceField } from '../interfaces/apiResource';
import { nodeField } from '../interfaces/node';
import { slugField } from '../interfaces/slug';
import { GraphQLObjectType, GraphQLString } from './standard';

const searchParamsType = new ParamsType('Search', {
  description: 'The params for the search.',
  fields: {
    query: GraphQLString
  }
});

export const type = new GraphQLObjectType({
  name: 'GlobalSearch',
  description: 'GlobalSearch resources',
  fields: () => ({
    brandfolders: {
      type: requireType('Brandfolder').connectionType,
      args: {
        ...requireType('Brandfolder').connectionArgs,
        search: {
          type: searchParamsType
        }
      },
      resolve: (o, args, context) => (
        connectionFromIndex('brandfolders', args, context)
      )
    },
    apiResource: apiResourceField,
    node: nodeField,
    slug: slugField
  })
});
