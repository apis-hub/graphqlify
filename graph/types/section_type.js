import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID } from 'graphql/type';
import { connectionArgs, connectionFromPromisedArray, globalIdField, connectionDefinitions }               from 'graphql-relay';

import { nodeInterface }   from '../node_identification';
import { slugInterface }   from '../slug_identification';
import { eventConnection } from './event_type';
import { assetConnection } from './asset_type';
import api                 from '../../adapters/api_adapter';

var sectionType = new GraphQLObjectType({
    name: 'section',
    description: 'A section item',
    fields: () => ({
        id:                 globalIdField('section'),
        name:               { type: new GraphQLNonNull(GraphQLString) },
        default_asset_type: { type: new GraphQLNonNull(GraphQLString) },
        position:           { type: GraphQLInt },
        brandfolder_id:     { type: GraphQLID},
        created_at:         { type: GraphQLString },
        updated_at:         { type: GraphQLString },
        //events:             { type: eventConnection,
        //                      description: 'The events tied to the section',
        //                      args: connectionArgs,
        //                      resolve: (section, args) => connectionFromPromisedArray(
        //                          section.__related('events'), args
        //                      )},
        assets:             { type: assetConnection,
                              description: 'The assets tied to the section',
                              args: connectionArgs,
                              resolve: (section, args) => connectionFromPromisedArray(
                                  section.__related('assets'), args
                              )}
    }),
    interfaces: [nodeInterface, slugInterface]
});

var { connectionType: sectionConnection, edgeType: GraphQLSectionEdge } =
    connectionDefinitions({ name: 'section', nodeType: sectionType });

export { sectionType, sectionConnection, GraphQLSectionEdge };