import {
  GraphQLInterfaceType, GraphQLString, GraphQLID, GraphQLNonNull
} from 'graphql';
import _ from 'lodash';
import { catchUnauthorized } from '../helpers/catchErrors';
import fetchTypeById from '../helpers/fetchTypeById';
import resolveType from '../helpers/resolveType';

_.mixin(require('lodash-inflection'));

let slugInterface = new GraphQLInterfaceType({
  name: 'Slug',
  description: `For objects that have a slug and that are routable on
                brandfolder.com`,
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    slug: {
      type: GraphQLString
    }
  },
  resolveType
});

let slugField = {
  name: 'slug',
  description: 'Fetches an object using the slug API.',
  type: slugInterface,
  args: {
    uri: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The slug uri of the object'
    }
  },
  resolve: (query, args, context) => fetchTypeById(
    'slug', args.uri, context, {}, 'slug'
  ).catch(
    catchUnauthorized(context.rootValue)
  )
};

export { slugInterface, slugField };
