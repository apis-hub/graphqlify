import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLAttachmentEdge } from '../types/attachment_type';
import { assetType }             from '../types/asset_type';
import { reusableDataType }      from '../types/reusable_data_type';
import api                       from '../../adapters/api_adapter';

const createAttachment = mutationWithClientMutationId({
    name: 'CreateAttachment',
    inputFields: {
        mimetype:      { type: GraphQLString },
        extension:     { type: GraphQLString },
        filename:      { type: GraphQLString },
        size:          { type: GraphQLInt },
        file_url:      { type: GraphQLString },
        thumbnail_url: { type: GraphQLString },
        preview_url:   { type: GraphQLString },
        thumbnailed:   { type: GraphQLBoolean },
        position:      { type: GraphQLInt },
        width:         { type: GraphQLInt },
        height:        { type: GraphQLInt },
        metadata:      { type: reusableDataType },
        asset_id:      { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        attachmentEdge: {
            type: GraphQLAttachmentEdge,
            resolve: ({attachmentId}) => {
                const attachment = api.getType('attachment').find(attachmentId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('attachment').all(), attachment),
                    node: attachment
                };
            }
        },
        asset: {
            type: assetType,
            resolve: ({localAssetId}) => {
                api.getType('asset').find(localAssetId);
            }
        }
    },
    mutateAndGetPayload: ({mimetype, extension, asset_id, filename, size, file_url, thumbnail_url, preview_url,
                            thumbnailed, position, width, height, metadata}) => {
        const localAssetId = fromGlobalId(asset_id).id;
        api.getType('attachment')
               .create({ mimetype: mimetype, extension: extension, filename: filename, size: size, file_url: file_url,
                         thumbnail_url: thumbnail_url, preview_url: preview_url, thumbnailed: thumbnailed,
                         position: position, width: width, height: height, metadata: metadata, asset_id: localAssetId })
               .then(result => { return { attachmentId: result.id, localAssetId, }; });
    },
});

const updateAttachment = mutationWithClientMutationId({
    name: 'UpdateAttachment',
    inputFields: {
        id:            { type: new GraphQLNonNull(GraphQLID) },
        mimetype:      { type: GraphQLString },
        extension:     { type: GraphQLString },
        asset_id:      { type: GraphQLID },
        filename:      { type: GraphQLString },
        size:          { type: GraphQLInt },
        file_url:      { type: GraphQLString },
        thumbnail_url: { type: GraphQLString },
        preview_url:   { type: GraphQLString },
        thumbnailed:   { type: GraphQLBoolean },
        position:      { type: GraphQLInt },
        width:         { type: GraphQLInt },
        height:        { type: GraphQLInt },
        metadata:      { type: reusableDataType },
    },
    outputFields: {
        attachmentEdge: {
            type: GraphQLAttachmentEdge,
            resolve: ({attachmentId}) => {
                const attachment = api.getType('attachment').find(attachmentId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('attachment').all(), attachment),
                    node: attachment
                }
            }
        },
    },
    mutateAndGetPayload: ({ id, mimetype, extension, asset_id, filename, size, file_url, thumbnail_url,
                            preview_url, thumbnailed, position, width, height, metadata}) => {
    const attachmentId = fromGlobalId(id).id;
        api.getType('attachment')
               .update(attachmentId, {asset_keys: asset_keys, mimetype: mimetype, extension: extension, asset_id: asset_id,
                                     filename: filename, size: size, file_url: file_url, thumbnail_url: thumbnail_url,
                                     preview_url: preview_url, thumbnailed: thumbnailed, position: position, width: width,
                                     height: height, metadata: metadata})
               .then(result => { return { attachmentId: result.id}; });
    },
});

const deleteAttachment = mutationWithClientMutationId({
    name: 'DeleteAttachment',
    inputFields: {
        id:   { type: new GraphQLNonNull(GraphQLID) },

    },
    outputFields: {
        attachmentEdge: {
            type: GraphQLAttachmentEdge,
            resolve: () => null
        }
    },
    mutateAndGetPayload: ({id}) => {
        var attachmentId = fromGlobalId(id).id;
        api.getType('attachment').remove(attachmentId);
    }
});

export { createAttachment, updateAttachment, deleteAttachment };