import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID
} from "graphql/type";
import {
    connectionArgs,
    globalIdField,
    connectionDefinitions
} from "graphql-relay";
import { nodeInterface } from "../node_identification";

var shareManifestType = new GraphQLObjectType({
    name: 'ShareManifest',
    description: 'A user permissions item',
    fields: () => ({
        id: globalIdField('shareManifest'),
        digest: { type: new GraphQLNonNull(GraphQLString) },
        internal: { type: new GraphQLNonNull(GraphQLBoolean) },
        require_identification: { type: new GraphQLNonNull(GraphQLBoolean) },
        expires: { type: new GraphQLNonNull(GraphQLBoolean) },
        availability_start: { type: GraphQLString },
        availability_end: { type: GraphQLString },
        time_zone: { type: new GraphQLNonNull(GraphQLString) },
        created_at: { type: new GraphQLNonNull(GraphQLString) },
        updated_at: { type: new GraphQLNonNull(GraphQLString) }
    }),
    interfaces: [ nodeInterface ]
});

var { connectionType: shareManifestConnection, edgeType: GraphQLShareManifestEdge } =
    connectionDefinitions({
        name: 'shareManifest',
        nodeType: shareManifestType
    });

export { shareManifestType, shareManifestConnection, GraphQLShareManifestEdge };
