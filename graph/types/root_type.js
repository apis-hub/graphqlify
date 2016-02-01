import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID
} from "graphql/type";
import {
    connectionArgs,
    connectionDefinitions,
    connectionFromPromisedArray,
    globalIdField
} from "graphql-relay";
import { HTTPError401 } from "JSONAPIonify-client/errors";
import { brandfolderConnection } from "./brandfolder_type";
import { organizationConnection } from "./organization_type";

function catchUnauthorized(rootValue) {
    return function (error) {
        if (error instanceof HTTPError401) {
            rootValue.statusCode = error.statusCode;
        }
        throw error
    }
}

var rootType = new GraphQLObjectType({
    name: 'Root',
    fields: () => ({
        url: {
            type: GraphQLString
        },
        brandfolders: {
            type: brandfolderConnection,
            args: connectionArgs,
            resolve: (root, args, context) => connectionFromPromisedArray(
                context.rootValue.client.resource('brandfolders').index().catch(catchUnauthorized(context.rootValue)), args
            )
        },
        organizations: {
            type: organizationConnection,
            args: connectionArgs,
            resolve: (root, args, context) => connectionFromPromisedArray(
                context.rootValue.client.resource('organizations').index().catch(catchUnauthorized(context.rootValue)), args
            )
        }
    })
});

export { rootType };
