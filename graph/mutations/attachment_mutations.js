import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLAttachmentEdge, attachmentType } from '../types/attachment_type';
import { assetType }             from '../types/asset_type';
import { reusableDataType }      from '../types/reusable_data_type';

const createAttachment = mutationWithClientMutationId({
    name: 'createAttachment',
    inputFields: {
        mimetype:      { type: GraphQLString },
        extension:     { type: GraphQLString },
        filename:      { type: GraphQLString },
        size:          { type: GraphQLInt },
        url:           { type: GraphQLString },
        file_url:      { type: GraphQLString },
        thumbnail_url: { type: GraphQLString },
        preview_url:   { type: GraphQLString },
        thumbnailed:   { type: GraphQLBoolean },
        width:         { type: GraphQLInt },
        height:        { type: GraphQLInt },
        metadata:      { type: reusableDataType },
        asset_id:      { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        attachment: {
            type: attachmentType,
            resolve: ({attachment}) => attachment
        },
        asset: {
            type: assetType,
            resolve: ({ assetId, rootContext}) => {
                return new Promise(function (resolve, reject){
                    rootContext.rootValue.client.resource('assets').read(assetId).then(function(asset){
                        resolve(asset)
                    }).catch(reject);
                })
            }
        }
    },
    mutateAndGetPayload: ({mimetype, extension, asset_id, filename, size, url, file_url, thumbnail_url, preview_url,
                            thumbnailed, width, height, metadata}, context) => {
        const assetId = asset_id;
        const rootContext = context;
        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('assets').read(assetId).then(function(asset){
                asset.__api__.related('attachments').then(function(attachments){
                    attachments.create(
                        'attachments',
                        {
                            mimetype: mimetype, url: url, extension: extension, filename: filename, size: size,
                            file_url: file_url, thumbnail_url: thumbnail_url, preview_url: preview_url,
                            thumbnailed: thumbnailed, width: width, height: height, metadata: metadata
                        }
                    ).then(function(attachment){
                        resolve( {attachment, assetId, rootContext })
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        })
    },
});

const updateAttachment = mutationWithClientMutationId({
    name: 'updateAttachment',
    inputFields: {
        id:            { type: new GraphQLNonNull(GraphQLID) },
        position:      { type: GraphQLInt },
        url:           { type: GraphQLString }
    },
    outputFields: {
        attachment: {
            type: attachmentType,
            resolve: ({attachment}) => attachment
        },
    },
    mutateAndGetPayload: ({ id, position, url}, context) => {
        const attachmentId = id;
        var attachmentPosition = position,
            attachmentUrl      = url;
        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('attachments').read(attachmentId).then(function (attachment) {
                if (attachmentPosition) { attachment.position = attachmentPosition }
                if (attachmentUrl) { attachment.url = attachmentUrl}

                attachment.__api__.update(attachment).then(function (attachment) {
                    resolve({ attachment });
                }).catch(reject);
            }).catch(reject);
        })
    }
});

const deleteAttachment = mutationWithClientMutationId({
    name: 'deleteAttachment',
    inputFields: {
        id:   { type: new GraphQLNonNull(GraphQLID) },

    },
    outputFields: {
        deletedId: {
            type: GraphQLID,
            resolve: ({attachmentId}) => attachmentId
        }
    },
    mutateAndGetPayload: ({id}, context) => {
        var attachmentId = id;
        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('attachments').read(attachmentId).then(function (attachment) {
                attachment.__api__.delete().then(function(){
                    return attachmentId;
                })
            }).catch(reject)
        })
    }
});

export { createAttachment, updateAttachment, deleteAttachment };