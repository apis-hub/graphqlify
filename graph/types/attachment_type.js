import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID,
    GraphQLScalarType
} from "graphql/type";
import {
    connectionArgs,
    connectionFromPromisedArray,
    globalIdField,
    connectionDefinitions
} from "graphql-relay";
import { nodeInterface } from "../node_identification";
import { slugInterface } from "../slug_identification";
import { reusableDataType } from "./reusable_data_type";
import { assetType } from "./asset_type";

var attachmentType = new GraphQLObjectType({
    name: 'Attachment',
    description: 'An attachment item',
    fields: () => ({
        id: globalIdField('attachment'),
        position: { type: GraphQLInt },
        url: { type: GraphQLString },
        mimetype: { type: GraphQLString },
        extension: { type: GraphQLString },
        filename: { type: GraphQLString },
        size: { type: GraphQLInt },
        file_url: { type: GraphQLString },
        thumbnail_url: { type: GraphQLString },
        preview_url: { type: GraphQLString },
        thumbnailed: { type: GraphQLBoolean },
        width: { type: GraphQLInt },
        height: { type: GraphQLInt },
        metadata: { type: reusableDataType },
        created_at: { type: new GraphQLNonNull(GraphQLString) },
        updated_at: { type: new GraphQLNonNull(GraphQLString) },
        asset: {
            type: assetType,
            resolve: (attachment, args)=> {
                return attachment.__api__.related('asset'), args
            }
        }

    }),
    interfaces: [ nodeInterface, slugInterface ]
});

var { connectionType: attachmentConnection, edgeType: GraphQLAttachmentEdge } =
    connectionDefinitions({ name: 'attachment', nodeType: attachmentType });

export { attachmentType, attachmentConnection, GraphQLAttachmentEdge };
