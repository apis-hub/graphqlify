import _ from 'lodash';
import {
  GraphQLInterfaceType, GraphQLString, GraphQLID, GraphQLNonNull
} from 'graphql';

import fetchTypeById from '../helpers/fetchTypeById';
import resolveType from '../helpers/resolveType';

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
  resolveType
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
    args.apiType, args.apiId, context, {}, 'apiResource'
  )
};

export { apiResourceInterface, apiResourceField };
