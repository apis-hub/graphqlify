import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID } from 'graphql/type';
import { connectionArgs, connectionDefinitions, connectionFromPromisedArray, globalIdField } from 'graphql-relay';

import { brandfolderConnection }    from './brandfolder_type';
import { organizationConnection }   from './organization_type';

var rootType = new GraphQLObjectType({
    name:   'Root',
    fields: () => ({
        url:           {
            type: GraphQLString
        },
        brandfolders:  {
            type:    brandfolderConnection,
            args:    connectionArgs,
            resolve: (root, args, context) => {
                debugger;
                return connectionFromPromisedArray(
                    context.rootValue.client.resource('brandfolders').index(), args
                )
            }
        },
        organizations: {
            type:    organizationConnection,
            args:    connectionArgs,
            resolve: (root, args, context) => connectionFromPromisedArray(
                context.rootValue.client.resource('organizations').index(), args
            )
        }
    })
});

export { rootType };