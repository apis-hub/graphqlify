import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql/type';
import { globalIdField, connectionDefinitions, connectionArgs, connectionFromPromisedArray } from 'graphql-relay';

import { nodeInterface } from '../node_identification';
import { slugInterface } from '../slug_identification';
import { assetType } from './asset_type';

var assetCommentType = new GraphQLObjectType({
    name: 'AssetComment',
    description: 'An asset comment',
    fields: () => ({
        id:         globalIdField('assetComment'),
        body:       { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        asset:      { type: assetType },
        replies:    { type: assetCommentConnection,
                     description: 'The asset comment replies',
                     args: connectionArgs,
                     resolve: (asset, args) => connectionFromPromisedArray(
                         assetComment.related('asset_comments'), args
                     )}

    }),
    interfaces: [nodeInterface, slugInterface]
});

var { connectionType: assetCommentConnection, edgeType: GraphQLAssetCommentEdge } =
        connectionDefinitions({ name: 'assetComment', nodeType: assetCommentType });

export { assetCommentType, assetCommentConnection, GraphQLAssetCommentEdge  };