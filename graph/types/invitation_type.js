import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID } from 'graphql/type';
import { connectionArgs, connectionFromPromisedArray, globalIdField, connectionDefinitions } from 'graphql-relay';

import { nodeInterface }    from '../node_identification';
import { slugInterface }    from '../slug_identification';
import { eventConnection }  from './event_type';

var invitationType = new GraphQLObjectType({
    name: 'Invitation',
    description: 'An invitation item',
    fields: () => ({
        id:               globalIdField('invitation'),
        email:            { type: new GraphQLNonNull(GraphQLString) },
        token:            { type: GraphQLString },
        inviter_id:       { type: GraphQLID },
        permission_level: { type: new GraphQLNonNull(GraphQLString) },
        personal_message: { type: GraphQLString },
        active:           { type: GraphQLBoolean },
        created_at:       { type: GraphQLString },
        updated_at:       { type: GraphQLString },
        //events:           { type: eventConnection,
        //                    description: 'The event tied to the invitation',
        //                    args: connectionArgs,
        //                    resolve: (invitation, args) => connectionFromPromisedArray(
        //                       invitation.related('events'), args
        //                    )}
    }),
    interfaces: [nodeInterface, slugInterface]
});

var {connectionType: invitationConnection, edgeType: GraphQLInvitationEdge} =
    connectionDefinitions({name: 'invitation', nodeType: invitationType});

export { invitationType, invitationConnection, GraphQLInvitationEdge };