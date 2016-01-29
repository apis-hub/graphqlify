import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLScalarType
} from "graphql/type";
import {
    connectionArgs,
    connectionDefinitions,
    globalIdField,
    connectionFromPromisedArray
} from "graphql-relay";
import { nodeInterface } from "../node_identification";
import { attachmentConnection } from "./attachment_type";
import { collectionConnection } from "./collection_type";
import { assetCommentConnection } from "./asset_comment_type";
import { reusableDataType } from "./reusable_data_type";


var assetType = new GraphQLObjectType({
    name: 'Asset',
    description: 'An asset item',
    fields: () => ({
        id: globalIdField('asset'),
        name: { type: new GraphQLNonNull(GraphQLString) },
        asset_type: { type: GraphQLString },
        thumbnail_url: { type: GraphQLString },
        preview_url: { type: GraphQLString },
        description: { type: GraphQLString },
        asset_data: { type: reusableDataType },
        tag_names: { type: new GraphQLList(GraphQLString) },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        attachments: {
            type: attachmentConnection,
            description: 'The attachment used by the asset',
            args: connectionArgs,
            resolve: (asset, args) => connectionFromPromisedArray(
                asset.__api__.related('attachments'), args
            )
        },
        collections: {
            type: collectionConnection,
            description: 'The collections the asset belongs to',
            args: connectionArgs,
            resolve: (asset, args) => connectionFromPromisedArray(
                asset.__api__.related('collections'), args
            )
        },
        comments: {
            type: assetCommentConnection,
            description: 'The comments on the asset',
            args: connectionArgs,
            resolve: (asset, args) => connectionFromPromisedArray(
                asset.__api__.related('comments'), args
            )
        }

    }),
    interfaces: [ nodeInterface ]
});

var { connectionType: assetConnection, edgeType: GraphQLAssetEdge } = connectionDefinitions({
    name: 'asset',
    nodeType: assetType
});

export { assetType, assetConnection, GraphQLAssetEdge };
