import { nodeDefinitions, fromGlobalId } from "graphql-relay";
import _ from "lodash";

_.mixin(require("lodash-inflection"));

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId, context) => {
    var {type, id} = fromGlobalId(globalId);
    return context.rootValue.api.resource(_.pluralize(type)).read(id);
  },
  (obj) => {
    var singular = _.singularize(obj.data.type);
    var typeFile = `./types/${_.camelCase(singular)}.js`;
    return require(typeFile).type;
  }
);

export { nodeInterface, nodeField };
