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
      //TBD
    },
    outputFields: {
        shareManifest: {
            type: shareManifestType,
            resolve: ({shareManifest}) => shareManifest
        }
    },
    mutateAndGetPayload: ({}, context) => {
        //TBD
    },
});


const deleteShareManifest = mutationWithClientMutationId({
    name: 'DeleteShareManifest',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        deletedId: {
            type: GraphQLID,
            resolve: ({shareManifestID}) => shareManifestID
        }
    },
    mutateAndGetPayload: ({id}) => {
        var shareManifestId = fromGlobalId(id).id;
        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('share_manifests').read(shareManifestId).then(function (shareManifest) {
                shareManifest.__api__.delete().then(function(){
                    resolve({shareMaifestId});
                })
            }).catch(reject)
        })
    }
});

export { createShareManifest, deleteShareManifest };
