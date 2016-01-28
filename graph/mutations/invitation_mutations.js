import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID,
    GraphQLList,
    GraphQLScalarType
} from "graphql/type";
import {
    mutationWithClientMutationId,
    cursorForObjectInConnection,
    fromGlobalId,
    connectionArgs
} from "graphql-relay";
import { invitationType } from "../types/invitation_type";
import { userType } from "../types/user_type";
import { brandfolderType } from "../types/brandfolder_type";

const createInvitation = mutationWithClientMutationId({
    name: 'createInvitation',
    inputFields: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        permission_level: { type: new GraphQLNonNull(GraphQLString) },
        personal_message: { type: GraphQLString },
        inviter_id: { type: new GraphQLNonNull(GraphQLID) },
        brandfolder_id: { type: new GraphQLNonNull(GraphQLID) }
    },
    outputFields: {
        invitation: {
            type: invitationType,
            resolve: ({ invitation }) => invitation
        },
        inviter: {
            type: userType,
            resolve: ({ userId, rootContext }) => {
                return new Promise(function (resolve, reject) {
                    rootContext.rootValue.client.resource('users').read(userId).then(function (user) {
                        resolve(user)
                    }).catch(reject);
                })
            }
        },
        brandfolder: {
            type: brandfolderType,
            resolve: ({ brandfolderId, rootContext }) => {
                return new Promise(function (resolve, reject) {
                    rootContext.rootValue.client.resource('brandfolders').read(brandfolderId).then(function (brandfolder) {
                        resolve(brandfolder)
                    }).catch(reject);
                })
            }
        }
    },
    mutateAndGetPayload: ({ email, inviter_id, permission_level, personal_message, brandfolder_id }, context) => {
        const userId = inviter_id;
        const brandfolderId = brandfolder_id;
        const rootContext = context;
        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('brandfolders').read(brandfolderId).then(function (brandfolder) {
                brandfolder.__api__.related('invitations').then(function (invitations) {
                    invitations.create('invitations', {
                        email: email,
                        permission_level: permission_level,
                        personal_message
                    }).then(function (invitation) {
                        resolve({
                            invitation,
                            userId,
                            brandfolderId,
                            rootContext
                        })
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        })
    },
});

const deleteInvitation = mutationWithClientMutationId({
    name: 'deleteInvitation',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        deletedId: {
            type: GraphQLID,
            resolve: ({ invitationId }) => invitationId
        }
    },
    mutateAndGetPayload: ({ id }, context) => {
        var invitationId = id;
        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('invitations').read(invitationId).then(function (invitation) {
                invitation.__api__.delete().then(function () {
                    return invitationId;
                })
            }).catch(reject)
        })
    }
});

export { createInvitation, deleteInvitation };
