import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLEventEdge, eventType }  from '../types/event_type';
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
       // TBD
    },
    outputFields: {
        // TBD
    },
    mutateAndGetPayload: ({},context) => {
        //TBD
    }
});

const deleteEvent = mutationWithClientMutationId({
    name: 'DeleteEvent',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        deletedId: {
            type: GraphQLID,
            resolve: ({eventId}) => eventId
        }
    },
    mutateAndGetPayload: ({id}) => {
        var eventId = id;
        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('events').read(eventId).then(function (event) {
                event.__api__.delete().then(function () {
                    resolve({ eventId });
                })
            }).catch(reject)
        })
    }
});

export { createEvent, deleteEvent };