import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql/type';
import { globalIdField, connectionDefinitions, connectionArgs, connectionFromPromisedArray } from 'graphql-relay';

import { nodeInterface } from '../node_identification';
import { slugInterface } from '../slug_identification';
import { assetConnection } from './asset_type';

var assetCommentsType = new GraphQLObjectType({
    name: 'AssetComments',
    description: 'An asset comment',
    fields: () => ({
        id:         globalIdField('assetComments'),
        body:       { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        assets:     { type: assetConnection,
                      description: 'The asset the asset comment belongs to',
                      args: connectionArgs,
                      resolve: (asset, args) => connectionFromPromisedArray(
                          assetComment.__related('assets'), args
                      )},
        replies:   { type: assetCommentsConnection,
                     description: 'The asset comment replies',
                     args: connectionArgs,
                     resolve: (asset, args) => connectionFromPromisedArray(
                         assetComment.__related('asset_comments'), args
                     )}

    }),
    interfaces: [nodeInterface, slugInterface]
});

var { connectionType: assetCommentsConnection, edgeType: GraphQLAssetCommentsEdge } =
        connectionDefinitions({ name: 'assetComments', nodeType: assetCommentsType });

export { assetCommentsType, assetCommentsConnection, GraphQLAssetCommentsEdge  };