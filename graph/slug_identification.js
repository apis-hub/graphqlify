import {
    GraphQLInterfaceType,
    GraphQLString,
    GraphQLID,
    GraphQLNonNull
} from "graphql";
import { nodeDefinitions, fromGlobalId } from "graphql-relay";

var slugInterface = new GraphQLInterfaceType({
    name: 'Slug',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString }
    },
    resolveType: (obj) => {
        var { brandfolderType } = require("./types/brandfolder_type");
        var { organizationType } = require("./types/organization_type");
        var { collectionType } = require("./types/collection_type");
        switch (obj.__api__.type()) {
            case "brandfolders":
                return brandfolderType;
                break;
            case "organizations":
                return organizationType;
                break;
            case "collections":
                return collectionType;
                break;
        }

    }
});

var slugField = {
    name: 'slug',
    description: 'Fetches an object by its slug uri.',
    type: slugInterface,
    args: {
        uri: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The slug uri of the object'
        }
    },
    resolve: (query, args, context) => {
        return context.rootValue.client.resource('slug').read(args.uri);
    }
};

export { slugInterface, slugField };
