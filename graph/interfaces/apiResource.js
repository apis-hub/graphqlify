import { GraphQLInterfaceType, GraphQLString, GraphQLID, GraphQLNonNull } from 'graphql';
import { catchUnauthorized } from '../helpers/catchErrors';
import fetchTypeById from '../helpers/fetchTypeById';
import _ from 'lodash';

_.mixin(require('lodash-inflection'));

let apiResourceInterface = new GraphQLInterfaceType({
  name: 'ApiResource',
  description: 'Api objects that can be fetched given a type and ID.',
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
    let singular = _.singularize(instance.type);
    let typeFile = `../types/${_.upperFirst(_.camelCase(singular))}.js`;
    return require(typeFile).type;
  }
});

let apiResourceField = {
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
    args.apiType, args.apiId, context, {}, 'node'
  ).catch(
    catchUnauthorized(context.rootValue)
  )
};

export { apiResourceInterface, apiResourceField };
