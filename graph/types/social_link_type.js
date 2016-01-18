import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql/type';
import { connectionArgs, connectionFromArray, globalIdField, connectionDefinitions } from 'graphql-relay';

import { nodeInterface }   from '../node_identification';
import { slugInterface }   from '../slug_identification';
import { eventConnection } from './event_type';
import api                 from '../../adapters/api_adapter';

var socialLinkType = new GraphQLObjectType({
    name: 'SocialLink',
    description: 'A social link item',
    fields: () => ({
        id:             globalIdField('socialLink'),
        name:           { type: new GraphQLNonNull(GraphQLString) },
        url:            { type: new GraphQLNonNull(GraphQLString) },
        position:       { type: GraphQLInt },
        brandfolder_id: { type: GraphQLID },
        created_at:     { type: GraphQLString },
        updated_at:     { type: GraphQLString },
        //events:         { type: eventConnection,
        //                  description: 'An event tied to the social link',
        //                  args: connectionArgs,
        //                  resolve: (link, args) => connectionFromPromisedArray(
        //                    link.__related('events'), args
        //                  )},
    }),
    interfaces: [nodeInterface, slugInterface]
});

var { connectionType: socialLinkConnection, edgeType: GraphQLSocialLinkEdge } =
    connectionDefinitions({ name: 'socialLink', nodeType: socialLinkType });

export { socialLinkType, socialLinkConnection, GraphQLSocialLinkEdge };