import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
        GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLAssetEdge }     from '../types/asset_type';
import { attachmentConnection } from '../types/attachment_type';
import { reusableDataType }     from '../types/reusable_data_type';
import api                      from '../../adapters/api_adapter';

const createAsset = mutationWithClientMutationId({
    name: 'CreateAsset',
    inputFields: {
        name:              { type: new GraphQLNonNull(GraphQLString) },
        description:       { type: GraphQLString },
        asset_type:        { type: GraphQLString },
        asset_data:        { type: reusableDataType },
        thumbnail_url:     { type: GraphQLString },
        preview_url:       { type: GraphQLString },
        tag_names:         { type: new GraphQLList(GraphQLString) }
    },
    outputFields: {
        assetEdge: {
            type: GraphQLAssetEdge,
            resolve: ({assetId}) => {
                const asset = api.getType('asset').find(assetId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('asset').all(), asset),
                    node: asset
                }
            }
        }
    },
    mutateAndGetPayload: ({name, description, asset_type, asset_data, thumbnail_url, preview_url, tag_names}) => {
        apapi.getType('asset')
               .create({name: name, description: description,  asset_type: asset_type, asset_data: asset_data,
                        thumbnail_url: thumbnail_url, preview_url: preview_url, tag_names: tag_names})
               .then(result => { return { assetId: result.id, }; });
    },
});

const updateAsset = mutationWithClientMutationId({
    name: 'UpdateAsset',
    inputFields: {
        id:            { type: new GraphQLNonNull(GraphQLID) },
        description:   { type: GraphQLString },
        asset_type:    { type: GraphQLString },
        asset_data:    { type: reusableDataType },
        thumbnail_url: { type: GraphQLString },
        preview_url:   { type: GraphQLString },
        tag_names:     { type: new GraphQLList(GraphQLString) },
    },
    outputFields: {
        assetEdge: {
            type: GraphQLAssetEdge,
            resolve: ({assetId}) => {
                const asset = api.getType('asset').find(assetId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('asset').all(), asset),
                    node: asset
                };
            },
        },
    },
    mutateAndGetPayload: ({ id, description, asset_type, asset_data, thumbnail_url, preview_url, tag_names}) => {
        const assetId = fromGlobalId(id).id;
        api.getType('asset')
               .update(assetId, {description: description, asset_type: asset_type, thumbnail_url: thumbnail_url,
                   preview_url: preview_url, asset_data: asset_data})
               .then(result=> { return { assetId: result.id }; });
    },
});

const deleteAsset = mutationWithClientMutationId({
    name: 'DeleteAsset',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        assetEdge: {
            type: GraphQLAssetEdge,
            resolve: () => null
        }
    },
    mutateAndGetPayload: ({id}) => {
        var assetId = fromGlobalId(id).id;
        api.getType('asset').remove(assetId);
    }
});

export { createAsset, updateAsset, deleteAsset };