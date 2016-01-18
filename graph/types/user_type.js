import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID } from 'graphql/type';
import { connectionArgs, connectionDefinitions, connectionFromPromisedArray, globalIdField } from 'graphql-relay';

import { nodeInterface }           from '../node_identification';
import { slugInterface }           from '../slug_identification';
import { eventConnection }         from './event_type';
import { brandfolderConnection }   from './brandfolder_type';
import { organizationConnection }  from './organization_type';
import { collectionConnection }    from './collection_type';
import { userPermissionConnection} from './user_permission_type';
import api                         from '../../adapters/api_adapter';

var userType = new GraphQLObjectType({
    name: 'User',
    description: 'A user permissions item',
    fields: () => ({
        id:                            globalIdField('user'),
        email:                         { type: new GraphQLNonNull(GraphQLString) },
        first_name:                    { type: GraphQLString },
        last_name:                     { type: GraphQLString },
        password:                      { type: new GraphQLNonNull(GraphQLString) },
        create_at:                     { type: GraphQLString },
        updated_at:                    { type: GraphQLString },
        //events:                        { type: eventConnection,
        //                                 description: 'The events tied to the user',
        //                                 args: connectionArgs,
        //                                 resolve: (user, args) => connectionFromPromisedArray(
        //                                     user.__related('events'), args
        //                                 )},
        user_permissions:              { type: userPermissionConnection,
                                         description: 'The user permissions tied to the user',
                                         args: connectionArgs,
                                         resolve: (user, args) => connectionFromPromisedArray(
                                             user.__related('user_permissions'), args
                                         )},
        brandfolders:                  { type: brandfolderConnection,
                                         description: 'The brandfolders tied to the user',
                                         args: connectionArgs,
                                         resolve: (user, args) => connectionFromPromisedArray(
                                             user.__related('brandfolders'), args
                                         )},
        organizations:                 { type: organizationConnection,
                                         description: 'The organizations tied to the user',
                                         args: connectionArgs,
                                         resolve: (user, args) => connectionFromPromisedArray(
                                           user.__related('organizations'), args
                                       )},
        collections:                   { type: collectionConnection,
                                         description: 'The collections tied to the user',
                                         args: connectionArgs,
                                         resolve: (user, args) => connectionFromPromisedArray(
                                             user.__related('collections'), args
                                         )},
    }),
    interfaces: [nodeInterface, slugInterface]
});

var { connectionType: userConnection, edgeType: GraphQLUserEdge } =
    connectionDefinitions({name: 'user', nodeType: userType});

export { userType, userConnection, GraphQLUserEdge };