import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLInvitationEdge } from '../types/invitation_type';
import { userType }              from '../types/user_type';
import api                       from '../../adapters/api_adapter';

const createInvitation = mutationWithClientMutationId({
    name: 'CreateInvitation',
    inputFields: {
        email:            { type: new GraphQLNonNull(GraphQLString) },
        token:            { type: GraphQLString },
        permission_level: { type: new GraphQLNonNull(GraphQLString) },
        personal_message: { type: GraphQLString },
        active:           { type: GraphQLBoolean },
        inviter_id:       { type: new GraphQLNonNull(GraphQLID) }
    },
    outputFields: {
        invitationEdge: {
            type: GraphQLInvitationEdge,
            resolve: ({invitationId}) => {
                const invitation = api.getType('invitation').find(invitationId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('invitation').all(), invitation),
                    node: invitation
                };
            }
        },
        inviter: {
            type: userType,
            resolve: ({localUserId}) => {
                api.getType('user').find(localUserId);
            }
        }
    },
    mutateAndGetPayload: ({email, token, inviter_id, permission_level, personal_message, active }) => {
        const localUserId = fromGlobalId(inviter_id).id;
        api.getType('invitation')
               .create({email: email, token: token, inviter_id: localUserId, permission_level: permission_level,
                        personal_message: personal_message, active: active})
               .then(result => { return { invitationId: result.id,  localUserId, }; });
    },
});

const deleteInvitation = mutationWithClientMutationId({
    name: 'DeleteInvitation',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        invitationEdge: {
            type: GraphQLInvitationEdge,
            resolve: () => null
        }
    },
    mutateAndGetPayload: ({id}) => {
        var invitationId = fromGlobalId(id).id;
        api.getType('invitation').remove(invitationId);
    }
});

export { createInvitation, deleteInvitation };