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
        assetGroupEdge: {
            type: GraphQLAssetGroupEdge,
            resolve: ({ assetGroupId }) => {
                const assetGroup = api.getType('assetGroup').find(assetGroupId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('assetGroup').all(), assetGroup),
                    node: assetGroup
                };
            }
        }
    },
    mutateAndGetPayload: ({ asset_keys }) => {
        api.getType('assetGroup')
            .create({ asset_keys: asset_keys })
            .then(result => {
                return { assetGroupId: result.id };
            });
    },
});

const updateAssetGroup = mutationWithClientMutationId({
    name: 'UpdateAssetGroup',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        asset_keys: { type: new GraphQLList(GraphQLString) },
    },
    outputFields: {
        assetGroupEdge: {
            type: GraphQLAssetGroupEdge,
            resolve: ({ assetGroupId }) => {
                const assetGroup = api.getType('assetGroup').find(assetGroupId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('assetGroup').all(), assetGroup),
                    node: assetGroup
                };
            },
        },

    },
    mutateAndGetPayload: ({ id, asset_keys }) => {
        const assetGroupId = fromGlobalId(id).id;
        api.getType('assetGroup')
            .update(assetGroupId, { asset_keys: asset_keys })
            .then(result => {
                return { assetGroupId: result.id }
            });
    },
});

const deleteAssetGroup = mutationWithClientMutationId({
    name: 'DeleteAssetGroup',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        assetGroupEdge: {
            type: GraphQLAssetGroupEdge,
            resolve: () => null
        }
    },
    mutateAndGetPayload: ({ id }) => {
        var assetGroupId = fromGlobalId(id).id;
        api.getType('assetGroup').remove(assetGroupId);
    }
});

export { createAssetGroup, updateAssetGroup, deleteAssetGroup };
