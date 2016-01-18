import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID } from 'graphql/type';
import { connectionArgs, connectionDefinitions, connectionFromPromisedArray, globalIdField } from 'graphql-relay';

import { brandfolderConnection }    from './brandfolder_type';
import { organizationConnection }   from './organization_type';
import api                          from '../../adapters/api_adapter.js';

var rootType = new GraphQLObjectType({
    name:   'Root',
    fields: () => ({
        id:            {
            type: GraphQLString
        },
        brandfolders:  {
            type:    brandfolderConnection,
            args:    connectionArgs,
            resolve: (root, args) => connectionFromPromisedArray(
                api.getType('brandfolders').all(), args
            )
        },
        organizations: {
            type:    organizationConnection,
            args:    connectionArgs,
            resolve: (root, args) => connectionFromPromisedArray(
                api.getType('organizations').all(), args
            )
        }
    })
});

export { rootType };