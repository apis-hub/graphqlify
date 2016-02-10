import { GraphQLObjectType } from "graphql/type";
import { nodeField } from "../node_identification";
import { slugField } from "../slug_identification";
import { rootType } from "./root_type";
import { organizationConnection } from "./organization_type";
import { userType } from "./user_type";
import { connectionArgs, connectionFromPromisedArray } from "graphql-relay";
import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLID } from "graphql/type";
import catchUnauthorized from "../../lib/catchUnauthorized";

var queryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The query root of the schema',
  fields: () => ({
    url: {
      type: GraphQLString,
      resolve: (context) => {
        return context.client.url
      }
    },
    current_user: {
      type: userType,
      resolve: (context) => {
        return context.client.resource('users').read('_self').catch(catchUnauthorized(context))
      }
    },
    ratelimit_limit: {
      type: GraphQLInt,
      resolve: (context) => {
        return context.client.client.options('').then(function(response) {
          var limit = response.headers._headers['x-ratelimit-limit'][0]
          return limit == 'Infinity' ? -1 : parseInt(limit)
        })
      }
    },
    ratelimit_remaining: {
      type: GraphQLInt,
      resolve: (context) => {
        return context.client.client.options('').then(function(response) {
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
