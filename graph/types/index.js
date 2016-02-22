import { nodeField } from "../interfaces/node";
import { slugField } from "../interfaces/slug";
import { apiResourceField } from "../interfaces/apiResource";
import { type as viewerType } from "./Viewer";
import { type as apiType } from "./Api";
import types from "../GraphQLTypes";
import { catchUnauthorized } from "../../lib/catchUnauthorized";

var queryType = new types.GraphQLObjectType({
  name: 'Query',
  description: 'The query root of the schema',
  fields: () => ({
    api: {
      type: apiType,
      resolve: (context) => context.api
    },
    viewer: {
      type: viewerType,
      resolve: (context) => {
        return new Object
      }
    },
    apiResource: apiResourceField,
    node: nodeField,
    slug: slugField
  })
});

export default queryType;
