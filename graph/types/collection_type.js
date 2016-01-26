import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLBoolean,
         GraphQLID, GraphQLScalarType } from 'graphql/type';
import { connectionArgs, connectionFromPromisedArray, globalIdField, connectionDefinitions } from 'graphql-relay';

import { nodeInterface }            from '../node_identification';
import { slugInterface }            from '../slug_identification';
import { assetConnection }          from './asset_type';
import { userConnection }           from './user_type';
import { userPermissionConnection } from './user_permission_type';
import { sectionConnection}         from './section_type';
import { reusableDataType }         from './reusable_data_type';
import { brandfolderType }          from './brandfolder_type';

var collectionType = new GraphQLObjectType({
    name: 'Collection',
    description: 'A collection item',
    fields: () => ({
        id:                               globalIdField('collection'),
        name:                             { type: new GraphQLNonNull(GraphQLString) },
        slug:                             { type: new GraphQLNonNull(GraphQLString) },
        public:                           { type: GraphQLBoolean },
        stealth:                          { type: GraphQLBoolean },
        options:                          { type: reusableDataType },
        created_at:                       { type: new GraphQLNonNull(GraphQLString) },
        updated_at:                       { type: new GraphQLNonNull(GraphQLString) },
        brandfolder:                      { type: brandfolderType },
        assets:                           { type: assetConnection,
                            description: 'The assets tied to the collection',
                            args: connectionArgs,
                            resolve: (collection, args) => connectionFromPromisedArray(
                                collection.related('assets'), args
                            )},
        sections:                         { type: sectionConnection,
                            description: 'The sections tied to the collection',
                            args: connectionArgs,
                            resolve: (collection, args) => connectionFromPromisedArray(
                                collection.related('sections'), args
                            )},
        admins:                           { type: userConnection,
                            description: 'The admins tied to the collection',
                            args: connectionArgs,
                            resolve: (collection, args) => connectionFromPromisedArray(
                                collection.related('admins'), args
                            )},
        collaborators:                    { type: userConnection,
                            description: 'The collaborators tied to the collection',
                            args: connectionArgs,
                            resolve: (collection, args) => connectionFromPromisedArray(
                                collection.related('collaborators'), args
                            )},
        guests:                           { type: userConnection,
                            description: 'The guests tied to the collection',
                            args: connectionArgs,
                            resolve: (collection, args) => connectionFromPromisedArray(
                                collection.related('guests'), args
                            )},
        users:                            { type:        userConnection,
                            description: 'The users tied to the brandfolder',
                            args:        connectionArgs,
                            resolve:     (collection, args) => connectionFromPromisedArray(
                                collection.related('users'), args
                            )},
        user_permissions:  { type:        userPermissionConnection,
                             description: 'The user permissions tied to the collection',
                             args:        connectionArgs,
                             resolve:     (collection, args) => connectionFromPromisedArray(
                                collection.related('user_permissions'), args
                           )},
    }),
    interfaces: [nodeInterface, slugInterface]
});

var { connectionType: collectionConnection, edgeType: GraphQLCollectionEdge } =
    connectionDefinitions({ name: 'collection', nodeType: collectionType });

export { collectionType, collectionConnection, GraphQLCollectionEdge };
