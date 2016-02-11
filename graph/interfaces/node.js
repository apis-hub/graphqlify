import { nodeDefinitions, fromGlobalId } from "graphql-relay";
import _ from "lodash";
import catchUnauthorized from "../../lib/catchUnauthorized";

_.mixin(require("lodash-inflection"));

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId, context) => {
    var {type, id} = fromGlobalId(globalId);
    return context.rootValue.api.resource(_.pluralize(_.snakeCase(type))).read(id).catch(catchUnauthorized(context.rootValue));
  },
  (obj) => {
    var singular = _.singularize(obj.type());
    var typeFile = `../types/${_.upperFirst(_.camelCase(singular))}.js`;
    return require(typeFile).type;
  }
);

export { nodeInterface, nodeField };
