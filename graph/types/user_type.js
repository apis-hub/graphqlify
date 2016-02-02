import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID } from "graphql/type";
import { connectionArgs, connectionDefinitions, connectionFromPromisedArray, globalIdField } from "graphql-relay";
import { nodeInterface } from "../node_identification";
import { brandfolderConnection } from "./brandfolder_type";
import { organizationConnection } from "./organization_type";
import { collectionConnection } from "./collection_type";

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A user permissions item',
  fields: () => ({
    id: globalIdField('user'),
    first_name: {
      type: GraphQLString
    },
    last_name: {
      type: GraphQLString
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
    create_at: {
      type: GraphQLString
    },
    updated_at: {
      type: GraphQLString
    },
    brandfolders: {
      type: brandfolderConnection,
      description: 'The brandfolders tied to the user',
      args: connectionArgs,
      resolve: (user, args) => connectionFromPromisedArray(
        user.__api__.related('brandfolders'), args
      )
    },
    organizations: {
      type: organizationConnection,
      description: 'The organizations tied to the user',
      args: connectionArgs,
      resolve: (user, args) => connectionFromPromisedArray(
        user.__api__.related('organizations'), args
      )
    },
    collections: {
      type: collectionConnection,
      description: 'The collections tied to the user',
      args: connectionArgs,
      resolve: (user, args) => connectionFromPromisedArray(
        user.__api__.related('collections'), args
      )
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: userConnection, edgeType: GraphQLUserEdge} = connectionDefinitions({
  name: 'user',
  nodeType: userType
});

export { userType, userConnection, GraphQLUserEdge };
