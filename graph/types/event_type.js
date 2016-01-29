import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLScalarType
} from "graphql/type";
import { globalIdField, connectionDefinitions } from "graphql-relay";
import { nodeInterface } from "../node_identification";

var eventType = new GraphQLObjectType({
    name: 'Event',
    description: 'An event item',
    fields: () => ({
        id: globalIdField('event'),
        user_id: { type: GraphQLID },
        brandfolder_id: { type: GraphQLID },
        collection_id: { type: GraphQLID },
        asset_id: { type: GraphQLID },
        attachment_id: { type: GraphQLID },
        invitation_id: { type: GraphQLID },
        action: { type: new GraphQLNonNull(GraphQLString) },
        user_agent: { type: GraphQLString },
        ip: { type: GraphQLString },
        lat: { type: GraphQLInt },
        long: { type: GraphQLInt },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        country: { type: GraphQLString },
        social_link_id: { type: GraphQLID },
        section_id: { type: GraphQLID },
        organization_id: { type: GraphQLID },
        share_manifest_id: { type: GraphQLID },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString }
    }),
    interfaces: [ nodeInterface ]
});

var { connectionType: eventConnection, edgeType: GraphQLEventEdge } =
    connectionDefinitions({ name: 'event', nodeType: eventType });

export { eventType, eventConnection, GraphQLEventEdge };
