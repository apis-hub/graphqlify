import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID } from "graphql/type";
import { connectionArgs, connectionDefinitions, connectionFromPromisedArray, globalIdField } from "graphql-relay";
import { HTTPError401 } from "JSONAPIonify-client/errors";
import { brandfolderConnection } from "./brandfolder_type";
import { organizationConnection } from "./organization_type";
import catchUnauthorized from "../../lib/catchUnauthorized";


var rootType = new GraphQLObjectType({
  name: 'Root',
  fields: {
    url: {
      type: GraphQLString
    },
    brandfolders: {
      type: brandfolderConnection,
      args: connectionArgs,
      resolve: (root, args, context) => connectionFromPromisedArray(
        context.rootValue.client.resource('brandfolders').list().catch(catchUnauthorized(context.rootValue)), args
      )
    },
    organizations: {
      type: organizationConnection,
      args: connectionArgs,
      resolve: (root, args, context) => {
        return connectionFromPromisedArray(
          context.rootValue.client.resource('organizations').list().catch(catchUnauthorized(context.rootValue)), args
        )
      }
    }
  }
});

export { rootType };
