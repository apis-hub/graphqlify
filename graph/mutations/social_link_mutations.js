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
import { socialLinkType } from "../types/social_link_type";
import { brandfolderType } from "../types/brandfolder_type";

const createSocialLink = mutationWithClientMutationId({
    name: 'createSocialLink',
    inputFields: {
        name: { type: GraphQLString },
        url: { type: new GraphQLNonNull(GraphQLString) },
        brandfolder_id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        socialLink: {
            type: socialLinkType,
            resolve: ({ socialLink }) => socialLink
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
    mutateAndGetPayload: ({ name, url, brandfolder_id }, context) => {
        const brandfolderId = fromGlobalId(brandfolder_id).id;
        const rootContext = context;
        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('brandfolders').read(brandfolderId).then(function (brandfolder) {
                brandfolder.__api__.related('social_links').then(function (social_links) {
                    social_links.create('social_links', {
                        name: name,
                        url: url
                    }).then(function (socialLink) {
                        resolve({ socialLink, brandfolderId, rootContext })
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        })
    },
});

const updateSocialLink = mutationWithClientMutationId({
    name: 'updateSocialLink',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        position: { type: GraphQLInt }
    },
    outputFields: {
        socialLink: {
            type: socialLinkType,
            resolve: ({ socialLink }) => socialLink
        }
    },
    mutateAndGetPayload: ({ id, description, socialLink_data, tag_names }, context) => {
        const socialLinkId = fromGlobalId(id).id;
        var socialLinkDescription = description,
            socialLinkData = socialLink_data,
            socialLinkTagNames = tag_names;

        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('social_links').read(socialLinkId).then(function (socialLink) {
                if (socialLinkDescription) {
                    socialLink.description = socialLinkDescription
                }
                if (socialLinkData) {
                    socialLink.socialLink_data = socialLinkData
                }
                if (socialLinkTagNames) {
                    socialLink.tag_names = socialLinkTagNames
                }

                socialLink.__api__.update(socialLink).then(function (socialLink) {
                    resolve({ socialLink });
                }).catch(reject);
            }).catch(reject);
        })
    }
});

const deleteSocialLink = mutationWithClientMutationId({
    name: 'deleteSocialLink',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        deletedId: {
            type: GraphQLID,
            resolve: ({ socialLinkId }) => socialLinkId
        }
    },
    mutateAndGetPayload: ({ id }, context) => {
        var socialLinkId = fromGlobalId(id).id;
        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('social_links').read(socialLinkId).then(function (social_link) {
                social_link.__api__.delete().then(function(){
                    resolve({socialLinkId});
                })
            }).catch(reject)
        })
    }
});

export { createSocialLink, updateSocialLink, deleteSocialLink };
