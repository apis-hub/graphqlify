import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql/type';
import { connectionArgs, connectionFromArray, globalIdField, connectionDefinitions } from 'graphql-relay';

import { nodeInterface }   from '../node_identification';
import { slugInterface }   from '../slug_identification';
import { brandfolderType } from './brandfolder_type';

var socialLinkType = new GraphQLObjectType({
    name: 'SocialLink',
    description: 'A social link item',
    fields: () => ({
        id:             globalIdField('socialLink'),
        name:           { type: new GraphQLNonNull(GraphQLString) },
        url:            { type: new GraphQLNonNull(GraphQLString) },
        position:       { type: GraphQLInt },
        created_at:     { type: GraphQLString },
        updated_at:     { type: GraphQLString },
        brandfolder:    { type: brandfolderType }

    }),
    interfaces: [nodeInterface, slugInterface]
});

var { connectionType: socialLinkConnection, edgeType: GraphQLSocialLinkEdge } =
    connectionDefinitions({ name: 'socialLink', nodeType: socialLinkType });

export { socialLinkType, socialLinkConnection, GraphQLSocialLinkEdge };