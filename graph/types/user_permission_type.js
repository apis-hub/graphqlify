import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLBoolean } from 'graphql/type';
import { connectionArgs, connectionFromPromisedArray, globalIdField, connectionDefinitions } from 'graphql-relay';

import { nodeInterface }   from '../node_identification';
import { slugInterface }   from '../slug_identification';
import { eventConnection } from './event_type';
import api                 from '../../adapters/api_adapter';

var userPermissionType = new GraphQLObjectType({
    name: 'UserPermission',
    description: 'A user permissions item',
    fields: () => ({
        id:               globalIdField('userPermission'),
        user_id:          { type: GraphQLID },
        permission_level: { type: new GraphQLNonNull(GraphQLString) },
        email:            { type: new GraphQLNonNull(GraphQLString) },
        created_at:       { type: GraphQLString },
        updated_at:       { type: GraphQLString },
        //events:           { type: eventConnection,
        //                    description: 'The events tied to the user permission',
        //                    args: connectionArgs,
        //                    resolve: (userPermission, args) => connectionFromPromisedArray(
        //                        userPermission.__related('events'), args
        //                    )}
    }),
    interfaces: [nodeInterface, slugInterface]
});

var { connectionType: userPermissionConnection, edgeType: GraphQLUserPermissionEdge } =
    connectionDefinitions({ name: 'userPermission', nodeType: userPermissionType });

export { userPermissionType, userPermissionConnection, GraphQLUserPermissionEdge };