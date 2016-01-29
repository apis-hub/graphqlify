import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean
} from "graphql/type";
import {
    connectionArgs,
    connectionFromPromisedArray,
    globalIdField,
    connectionDefinitions
} from "graphql-relay";
import { nodeInterface } from "../node_identification";
import { userType } from "./user_type";

var userPermissionType = new GraphQLObjectType({
    name: 'UserPermission',
    description: 'A user permissions item',
    fields: () => ({
        id: globalIdField('userPermission'),
        permission_level: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        user: {
            type: userType,
            resolve: (userPermission, args) => {
                return userPermission.__api__.related('user'), args
            }
        }
    }),
    interfaces: [ nodeInterface ]
});

var { connectionType: userPermissionConnection, edgeType: GraphQLUserPermissionEdge } =
    connectionDefinitions({
        name: 'userPermission',
        nodeType: userPermissionType
    });

export {
    userPermissionType,
    userPermissionConnection,
    GraphQLUserPermissionEdge
};
