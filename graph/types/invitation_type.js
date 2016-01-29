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
    connectionFromPromisedArray,
    globalIdField,
    connectionDefinitions
} from "graphql-relay";
import { nodeInterface } from "../node_identification";
import { userType } from "./user_type";

var invitationType = new GraphQLObjectType({
    name: 'Invitation',
    description: 'An invitation item',
    fields: () => ({
        id: globalIdField('invitation'),
        email: { type: new GraphQLNonNull(GraphQLString) },
        permission_level: { type: new GraphQLNonNull(GraphQLString) },
        personal_message: { type: GraphQLString },
        token: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        inviter: {
            type: userType,
            resolve: (invitation, args) => {
                return invitation.__api__.related('inviter'), args
            }
        }
    }),
    interfaces: [ nodeInterface ]
});

var { connectionType: invitationConnection, edgeType: GraphQLInvitationEdge } =
    connectionDefinitions({ name: 'invitation', nodeType: invitationType });

export { invitationType, invitationConnection, GraphQLInvitationEdge };
