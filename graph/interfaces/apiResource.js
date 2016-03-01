import { GraphQLInterfaceType, GraphQLString, GraphQLID, GraphQLNonNull } from 'graphql';
import { catchUnauthorized } from '../../lib/catchUnauthorized';
import { fetchTypeById } from '../typeHelpers';
import _ from 'lodash';

_.mixin(require('lodash-inflection'));

var apiResourceInterface = new GraphQLInterfaceType({
  name: 'ApiResource',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    apiType: {
      type: new GraphQLNonNull(GraphQLString)
    },
    apiId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolveType: ({ instance }) => {
    var singular = _.singularize(instance.type);
    var typeFile = `../types/${_.upperFirst(_.camelCase(singular))}.js`;
    return require(typeFile).type;
  }
});

var apiResourceField = {
  name: 'apiResource',
  description: 'Fetches an object by its resource type and Api ID.',
  type: apiResourceInterface,
  args: {
    apiType: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The api resource type'
    },
    apiId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The api resource id'
    }
  },
  resolve: (query, args, context) => fetchTypeById(
    args.apiType, args.apiId, context, 'node'
  ).catch(
    catchUnauthorized(context.rootValue)
  )
};

export { apiResourceInterface, apiResourceField };
