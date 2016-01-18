import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLAssetCommentsEdge } from '../types/asset_comments_type';
import api                          from '../../adapters/api_adapter';

const createAssetComments = mutationWithClientMutationId({
    name: 'CreateAssetComments',
    inputFields: {
        body: { type: GraphQLString }
    },
    outputFields: {
        assetCommentsEdge: {
            type: GraphQLAssetCommentsEdge,
            resolve: ({assetCommentsId}) => {
                const assetComments = api.getType('assetComments').find(assetCommentsId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('assetComments').all(), assetComments),
                    node: assetComments
                };
            }
        }
    },
    mutateAndGetPayload: ({body}) => {
        api.getType('assetComments')
            .create({body: body})
            .then(result => { return { assetCommentsId: result.id }; });
    },
});

const updateAssetComments = mutationWithClientMutationId({
    name: 'UpdateAssetComments',
    inputFields: {
        id:   { type: new GraphQLNonNull(GraphQLID) },
        body: { type: GraphQLString},
    },
    outputFields: {
        assetCommentsEdge: { type: GraphQLAssetCommentsEdge,
            resolve: ({assetCommentsId}) => {
                const assetComments = api.getType('assetComments').find(assetCommentsId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('assetComments').all(), assetComments),
                    node: assetComments
                };
            },
        },

    },
    mutateAndGetPayload: ({ id, body }) => {
        const assetCommentsId = fromGlobalId(id).id;
        api.getType('assetComments')
            .update(assetCommentsId, {body: body})
            .then(result => { return { assetCommentsId: result.id }});
    },
});

const deleteAssetComments = mutationWithClientMutationId({
        name: 'DeleteAssetComments',
        inputFields: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        outputFields: {
            assetCommentsEdge: {
                                type: GraphQLAssetCommentsEdge,
                                resolve: () => null
        }
    },
    mutateAndGetPayload: ({id}) => {
        var assetCommentsId = fromGlobalId(id).id;
        api.getType('assetComments').remove(assetCommentsId);
    }
});

export { createAssetComments, updateAssetComments, deleteAssetComments };