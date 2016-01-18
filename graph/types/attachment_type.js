import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean,
         GraphQLID, GraphQLScalarType } from 'graphql/type';
import { connectionArgs, connectionFromPromisedArray, globalIdField, connectionDefinitions } from 'graphql-relay';

import { nodeInterface }    from '../node_identification';
import { slugInterface }    from '../slug_identification';
import { eventConnection }  from './event_type';
import { reusableDataType } from './reusable_data_type';
import api                  from '../../adapters/api_adapter';

var attachmentType = new GraphQLObjectType({
    name: 'Attachment',
    description: 'An attachment item',
    fields: () => ({
        id:                    globalIdField('attachment'),
        mimetype:              { type: GraphQLString },
        extension:             { type: GraphQLString },
        asset_id:              { type: GraphQLID },
        filename:              { type: GraphQLString },
        size:                  { type: GraphQLInt },
        file_url:              { type: GraphQLString },
        thumbnail_url:         { type: GraphQLString },
        preview_url:           { type: GraphQLString },
        thumbnailed:           { type: GraphQLBoolean },
        position:              { type: GraphQLInt },
        width:                 { type: GraphQLInt },
        height:                { type: GraphQLInt },
        metadata:              { type: reusableDataType },
        created_at:            { type: new GraphQLNonNull(GraphQLString) },
        updated_at:            { type: new GraphQLNonNull(GraphQLString) },
        //events:                { type: eventConnection,
        //                        description: 'The events tied to an attachment',
        //                        args: connectionArgs,
        //                        resolve: (attachment, args) => connectionFromPromisedArray(
        //                            attachment.__related('events'), args
        //                        )}
    }),
    interfaces: [nodeInterface, slugInterface]
});

var {connectionType: attachmentConnection, edgeType: GraphQLAttachmentEdge } =
    connectionDefinitions({name: 'attachment', nodeType: attachmentType});

export {attachmentType, attachmentConnection, GraphQLAttachmentEdge };