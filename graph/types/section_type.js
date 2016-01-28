import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID
} from "graphql/type";
import {
    connectionArgs,
    connectionFromPromisedArray,
    globalIdField,
    connectionDefinitions
} from "graphql-relay";
import { nodeInterface } from "../node_identification";
import { slugInterface } from "../slug_identification";
import { assetConnection } from "./asset_type";
import { brandfolderType } from "./brandfolder_type";

var sectionType = new GraphQLObjectType({
    name: 'section',
    description: 'A section item',
    fields: () => ({
        id: globalIdField('section'),
        name: { type: new GraphQLNonNull(GraphQLString) },
        default_asset_type: { type: new GraphQLNonNull(GraphQLString) },
        position: { type: GraphQLInt },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        brandfolder: {
            type: brandfolderType,
            resolve: (section, args) => {
                return section.__api__.related('brandfolder'), args
            }
        },
        assets: {
            type: assetConnection,
            description: 'The assets tied to the section',
            args: connectionArgs,
            resolve: (section, args) => connectionFromPromisedArray(
                section.__api__.related('assets'), args
            )
        }
    }),
    interfaces: [ nodeInterface, slugInterface ]
});

var { connectionType: sectionConnection, edgeType: GraphQLSectionEdge } =
    connectionDefinitions({ name: 'section', nodeType: sectionType });

export { sectionType, sectionConnection, GraphQLSectionEdge };
