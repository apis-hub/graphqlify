import { GraphQLInterfaceType, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";
import _ from "lodash";
import { catchUnauthorized } from "../../lib/catchUnauthorized";

_.mixin(require("lodash-inflection"));

var apiResourceInterface = new GraphQLInterfaceType({
  name: 'ApiResource',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    apiType: {
      type: new GraphQLNonNull(GraphQLString)
    },
    apiId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolveType: (obj) => {
    var singular = _.singularize(obj.type());
    var typeFile = `../types/${_.upperFirst(_.camelCase(singular))}.js`;
    return require(typeFile).type;
  }
});

var apiResourceField = {
  name: 'apiResource',
  description: 'Fetches an object by its resource type and Api ID.',
  type: apiResourceInterface,
  args: {
    apiType: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The api resource type'
    },
    apiId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The api resource id'
    }
  },
  resolve: (query, args, context) => {
    return context.rootValue.api.resource(args.apiType).read(args.apiId).catch(catchUnauthorized(context.rootValue));
  }
};

export { apiResourceInterface, apiResourceField };
