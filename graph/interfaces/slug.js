import { GraphQLInterfaceType, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";
import _ from "lodash";
import { catchUnauthorized } from "../../lib/catchUnauthorized";

_.mixin(require("lodash-inflection"));

var slugInterface = new GraphQLInterfaceType({
  name: 'Slug',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    slug: {
      type: GraphQLString
    }
  },
  resolveType: (obj) => {
    var singular = _.singularize(obj.type());
    var typeFile = `../types/${_.upperFirst(_.camelCase(singular))}.js`;
    return require(typeFile).type;
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
    return context.rootValue.api.resource('slug').read(args.uri).catch(catchUnauthorized(context.rootValue));
  }
};

export { slugInterface, slugField };
