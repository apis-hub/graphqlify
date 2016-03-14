import { nodeDefinitions, fromGlobalId } from 'graphql-relay';
import _ from 'lodash';
import { catchUnauthorized } from '../helpers/catchErrors';
import fetchTypeById from '../helpers/fetchTypeById';

_.mixin(require('lodash-inflection'));

var { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, context) => {
    var { type, id } = fromGlobalId(globalId);
    type = _.pluralize(type.toLowerCase());
    return fetchTypeById(
      type, id, context, {}, 'node'
    ).catch(
      catchUnauthorized(context.rootValue)
    );
  },
  ({ instance }) => {
    let singular = _.singularize(instance.type);
    let typeFile = `../types/${_.upperFirst(_.camelCase(singular))}.js`;
    return require(typeFile).type;
  }
);

export { nodeInterface, nodeField };
