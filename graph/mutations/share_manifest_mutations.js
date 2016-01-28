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
import { GraphQLShareManifestEdge } from "../types/share_manifest_type";
import api from "../../adapters/api_adapter";

const createShareManifest = mutationWithClientMutationId({
    name: 'CreateShareManifest',
    inputFields: {
        digest: { type: new GraphQLNonNull(GraphQLString) },
        internal: { type: new GraphQLNonNull(GraphQLBoolean) },
        require_identification: { type: new GraphQLNonNull(GraphQLBoolean) },
        expires: { type: new GraphQLNonNull(GraphQLBoolean) },
        availability_start: { type: GraphQLString },
        availability_end: { type: GraphQLString },
        time_zone: { type: new GraphQLNonNull(GraphQLString) },
    },
    outputFields: {
        shareManifestEdge: {
            type: GraphQLShareManifestEdge,
            resolve: ({ shareManifestId }) => {
                const shareManifest = api.getType('shareManifest').find(shareManifestId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('shareManifest').all(), shareManifest),
                    node: shareManifest
                };
            }
        }
    },
    mutateAndGetPayload: ({
        digest, internal,
        require_identification, expires, availability_start, availability_end, time_zone
    }) => {
        api.getType('shareManifest')
            .create({
                digest: digest,
                internal: internal,
                require_identification: require_identification,
                expires: expires,
                availability_start: availability_start,
                availability_end: availability_end,
                time_zone: time_zone
            })
            .then(result => {
                return { shareManifestId: result.id }
            });
    },
});


const deleteShareManifest = mutationWithClientMutationId({
    name: 'DeleteShareManifest',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        shareManifestEdge: {
            type: GraphQLShareManifestEdge,
            resolve: () => null
        }
    },
    mutateAndGetPayload: ({ id }) => {
        var shareManifestId = fromGlobalId(id).id;
        api.getType('shareManifest').remove(shareManifestId);
    }
});

export { createShareManifest, deleteShareManifest };
