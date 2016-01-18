import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLEventEdge }  from '../types/event_type';
import { userType }          from '../types/user_type';
import { brandfolderType }   from '../types/brandfolder_type';
import { collectionType }    from '../types/collection_type';
import { assetType }         from '../types/asset_type';
import { invitationType }    from '../types/invitation_type';
import { socialLinkType }    from '../types/social_link_type';
import { sectionType }       from '../types/section_type';
import { organizationType }  from '../types/organization_type';
import { shareManifestType } from '../types/share_manifest_type';
import api                       from '../../adapters/api_adapter';

const createEvent = mutationWithClientMutationId({
    name: 'CreateEvent',
    inputFields: {
        action:              { type: new GraphQLNonNull(GraphQLString) },
        user_agent:          { type: GraphQLString },
        ip:                  { type: GraphQLString },
        lat:                 { type: GraphQLInt },
        long:                { type: GraphQLInt },
        city:                { type: GraphQLString },
        state:               { type: GraphQLString },
        country:             { type: GraphQLString },
        user_id:             { type: new GraphQLNonNull(GraphQLID) },
        brandfolder_id:      { type: GraphQLID },
        collection_id:       { type: GraphQLID },
        asset_id:            { type: GraphQLID },
        invitation_id:       { type: GraphQLID },
        social_link_id:      { type: GraphQLID },
        section_id:          { type: GraphQLID },
        organization_id:     { type: new GraphQLNonNull(GraphQLID) },
        share_manifest_id:   { type: GraphQLID },
    },
    outputFields: {
        eventEdge: {
            type: GraphQLEventEdge,
            resolve: ({eventId}) => {
                const event = api.getType('event').find(eventId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('event').all(), event),
                    node: event
                };
            }
        },
        user: {
            type: userType,
            resolve: ({localUserId}) => {
                api.getType('user').find(localUserId);
            }
        },
        organization: {
            type: organizationType,
            resolve: ({localOrganizationId}) => {
               api.getType('organization').find(localOrganizationId);
            }
        },
        brandfolder: {
            type: brandfolderType,
            resolve: ({localBrandfolderId}) => {
                api.getType('brandfolder').find(localBrandfolderId);
            }
        },
        collection: {
            type: collectionType,
            resolve: ({localCollectionId}) => {
                api.getType('collection').find(localCollectionId);
            }
        },
        asset: {
            type: assetType,
            resolve: ({localAssetId}) => {
               api.getType('asset').find(localAssetId);
            }
        },
        invitation: {
            type: assetType,
            resolve: ({localInvitationId}) => {
                api.getType('invitation').find(localInvitationId);
            }
        },
        social_link: {
            type: socialLinkType,
            resolve: ({localSocialLinkId}) => {
                api.getType('socialLink').find(localSocialLinkId);
            }
        },
        section: {
            type: sectionType,
            resolve: ({localSectionId}) => {
                api.getType('section').find(localSectionId);
            }
        },
        share_manifest: {
            type: shareManifestType,
            resolve: ({localShareManifestId}) => {
                api.getType('shareManifest').find(localShareManifestId);
            }
        }
    },
    mutateAndGetPayload: ({user_id, brandfolder_id, collection_id, asset_id, invitation_id,
        action, user_agent, ip, lat, long, city, state, country,
        social_link_id, section_id, organization_id, share_manifest_id}) => {
            const localUserId = fromGlobalId(user_id).id,
                  localOrganizationId = fromGlobalId(organization_id).id,
                  localBrandfolderId = fromGlobalId(brandfolder_id).id,
                  localCollectionId = fromGlobalId(collection_id).id,
                  localAssetId = fromGlobalId(asset_id).id,
                  localInvitationId = fromGlobalId(invitation_id).id,
                  localSocialLinkId = fromGlobalId(social_link_id).id,
                  localSectionId = fromGlobalId(section_id).id,
                  localShareManifestId = fromGlobalId(share_manifest_id).id;
            api.getType('event')
                   .create({action: action, user_agent: user_agent, ip: ip, lat: lat, long: long, city: city,
                            state: state, country: country, user_id: localUserId, brandfolder_id: localBrandfolderId,
                            collection_id: localCollectionId, asset_id: localAssetId, invitation_id: localInvitationId,
                            social_link_id: localSocialLinkId, section_id: localSectionId,
                            organization_id: localOrganizationId, share_manifest_id: localShareManifestId})
                   .then(result => { return { eventId: result.id, localUserId, localOrganizationId, localBrandfolderId,
                                              localCollectionId, localAssetId, localInvitationId, localSocialLinkId,
                                              localSectionId, localShareManifestId, }; });
    },
});

const deleteEvent = mutationWithClientMutationId({
    name: 'DeleteEvent',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        eventEdge: {
            type: GraphQLEventEdge,
            resolve: () => null
        }
    },
    mutateAndGetPayload: ({id}) => {
        var eventId = fromGlobalId(id).id;
        api.getType('event').remove(eventId);
    }
});

export { createEvent, deleteEvent };