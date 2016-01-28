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
import { GraphQLAssetGroupEdge } from "../types/asset_group_type";
import api from "../../adapters/api_adapter";

const createAssetGroup = mutationWithClientMutationId({
    name: 'CreateAssetGroup',
    inputFields: {
        asset_keys: { type: new GraphQLList(GraphQLString) }
    },
    outputFields: {
        assetGroup: {
            type: assetGroupType,
            resolve: ({assetGroup}) => assetGroup
        }
    },
    mutateAndGetPayload: ({asset_keys, context}) => {
        // TBD
    }
});

const updateAssetGroup = mutationWithClientMutationId({
    name: 'UpdateAssetGroup',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        asset_keys: { type: new GraphQLList(GraphQLString) },
    },
    outputFields: {
        assetGroup: {
            type: assetGroupType,
            resolve: ({assetGroup}) => assetGroup
        },
    },
    mutateAndGetPayload: ({ id, asset_keys }) => {
        // TBD
    }
});

const deleteAssetGroup = mutationWithClientMutationId({
    name: 'DeleteAssetGroup',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        deletedId: {
            type: GraphQLID,
            resolve: ({deletedId}) => deletedId
        }
    },
    mutateAndGetPayload: ({id}) => {
        var deletedId = id;
        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('asset_groups').read(deletedId).then(function (assetGroup) {
                assetGroup.__api__.delete().then(function(){
                    resolve({deletedId});
                })
            }).catch(reject)
        })
    }
});

export { createAssetGroup, updateAssetGroup, deleteAssetGroup };
