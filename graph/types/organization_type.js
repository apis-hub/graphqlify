import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID,
    GraphQLScalarType
} from "graphql/type";
import {
    connectionArgs,
    connectionFromPromisedArray,
    globalIdField,
    connectionDefinitions
} from "graphql-relay";
import { nodeInterface } from "../node_identification";
import { slugInterface } from "../slug_identification";
import { brandfolderConnection } from "./brandfolder_type";
import { userConnection } from "./user_type";
import { userPermissionConnection } from "./user_permission_type";

var organizationType = new GraphQLObjectType({
    name: 'Organization',
    description: 'An organization item',
    fields: () => ({
        id: globalIdField('organization'),
        name: { type: GraphQLString },
        slug: { type: new GraphQLNonNull(GraphQLString) },
        branded_login_image: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        brandfolders: {
            type: brandfolderConnection,
            description: 'The brandfolders tied to the organization',
            args: connectionArgs,
            resolve: (organization, args) => connectionFromPromisedArray(
                organization.__api__.related('brandfolders'), args
            )
        },
        owners: {
            type: userConnection,
            description: 'The owners tied to the organization',
            args: connectionArgs,
            resolve: (organization, args) => connectionFromPromisedArray(
                organization.__api__.related('owners'), args
            )
        },
        admins: {
            type: userConnection,
            description: 'The adminss tied to the organization',
            args: connectionArgs,
            resolve: (organization, args) => connectionFromPromisedArray(
                organization.__api__.related('admins'), args
            )
        },
        collaborators: {
            type: userConnection,
            description: 'The collaborators tied to the organization',
            args: connectionArgs,
            resolve: (organization, args) => connectionFromPromisedArray(
                organization.__api__.related('collaborators'), args
            )
        },
        guests: {
            type: userConnection,
            description: 'The guests tied to the organization',
            args: connectionArgs,
            resolve: (organization, args) => connectionFromPromisedArray(
                organization.__api__.related('guests'), args
            )
        },
        users: {
            type: userConnection,
            description: 'The users tied to the organization',
            args: connectionArgs,
            resolve: (organization, args) => connectionFromPromisedArray(
                organization.__api__.related('users'), args
            )
        },
        user_permissions: {
            type: userPermissionConnection,
            description: 'The user permissions tied to the organization',
            args: connectionArgs,
            resolve: (collection, args) => connectionFromPromisedArray(
                collection.__api__.related('user_permissions'), args
            )
        }
    }),
    interfaces: [ nodeInterface, slugInterface ]
});

var { connectionType: organizationConnection, edgeType: GraphQLOrganizationEdge } =
    connectionDefinitions({ name: 'organization', nodeType: organizationType });

export { organizationType, organizationConnection, GraphQLOrganizationEdge } ;
