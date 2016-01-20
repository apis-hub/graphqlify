import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { connectionArgs, connectionDefinitions, globalIdField, connectionFromPromisedArray } from 'graphql-relay';

import { nodeInterface }            from '../node_identification';
import { slugInterface }            from '../slug_identification';
import { attachmentConnection }     from './attachment_type';
import { eventConnection }          from './event_type';
import { sectionConnection }        from './section_type';
import { collectionConnection }     from './collection_type';
import { assetCommentsConnection }  from './asset_comments_type';
import { reusableDataType }         from './reusable_data_type';



var assetType = new GraphQLObjectType({
    name: 'Asset',
    description: 'An asset item',
    fields: () => ({
        id:                globalIdField('asset'),
        name:              { type: new GraphQLNonNull(GraphQLString) },
        description:       { type: GraphQLString },
        asset_type:        { type: GraphQLString },
        asset_data:        { type: reusableDataType },
        thumbnail_url:     { type: GraphQLString },
        preview_url:       { type: GraphQLString },
        tag_names:         { type: new GraphQLList(GraphQLString)},
        created_at:        { type: GraphQLString },
        updated_at:        { type: GraphQLString },
        attachments:       { type: attachmentConnection,
                             description: 'The attachment used by the asset',
                             args: connectionArgs,
                             resolve: (asset, args) => connectionFromPromisedArray(
                                 asset.related('attachments'), args
                             )},
        //events:            { type: eventConnection,
        //                     description: 'An event tied to the asset',
        //                     args: connectionArgs,
        //                        resolve: (asset, args) => connectionFromPromisedArray(
        //                         asset.__related('events'), args
        //                   )},
        collections:       { type: collectionConnection,
                             description: 'The collections the asset belongs to',
                             args: connectionArgs,
                             resolve: (asset, args) => connectionFromPromisedArray(
                                 asset.related('collections'), args
                            )},
        comments:          { type: assetCommentsConnection,}

    }),
    interfaces: [nodeInterface, slugInterface]
});

var { connectionType: assetConnection, edgeType: GraphQLAssetEdge } = connectionDefinitions({name: 'asset', nodeType: assetType});

export { assetType, assetConnection, GraphQLAssetEdge };
