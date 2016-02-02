import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from "graphql/type";
import { globalIdField, connectionDefinitions } from "graphql-relay";
import { nodeInterface } from "../node_identification";
import { slugInterface } from "../slug_identification";

var assetGroupType = new GraphQLObjectType({
  name: 'AssetGroup',
  description: 'An asset group item',
  fields: () => ({
    id: globalIdField('assetGroup'),
    created_at: {
      type: GraphQLString
    },
    updated_at: {
      type: GraphQLString
    },
    asset_keys: {
      type: new GraphQLList(GraphQLString)
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: assetGroupConnection, edgeType: GraphQLAssetGroupEdge} = connectionDefinitions({
  name: 'assetGroup',
  nodeType: assetGroupType
});

export { assetGroupType, assetGroupConnection, GraphQLAssetGroupEdge };
