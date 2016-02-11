import { nodeField } from "../interfaces/node";
import { slugField } from "../interfaces/slug";
import { type as userType } from "./User";
import types from "../GraphQLTypes";
import catchUnauthorized from "../../lib/catchUnauthorized";

var queryType = new types.GraphQLObjectType({
  name: 'Query',
  description: 'The query root of the schema',
  fields: () => ({
    url: {
      type: types.GraphQLString,
      resolve: (context) => {
        return context.api.url
      }
    },
    current_user: {
      type: userType,
      resolve: (context) => {
        return context.api.resource('users').read('_self').catch(catchUnauthorized(context))
      }
    },
    ratelimit_limit: {
      type: types.GraphQLInt,
      resolve: (context) => {
        return context.api.client.options('').then(function(response) {
          var limit = response.headers._headers['x-ratelimit-limit'][0]
          return limit == 'Infinity' ? -1 : parseInt(limit)
        })
      }
    },
    ratelimit_remaining: {
      type: types.GraphQLInt,
      resolve: (context) => {
        return context.api.client.options('').then(function(response) {
          var limit = response.headers._headers['x-ratelimit-remaining'][0]
          return limit == 'Infinity' ? -1 : parseInt(limit)
        })
      }
    },
    node: nodeField,
    slug: slugField
  })
});

export default queryType;
