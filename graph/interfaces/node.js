import { nodeDefinitions, fromGlobalId } from 'graphql-relay';
import _ from 'lodash';
import { catchUnauthorized } from '../../lib/catchUnauthorized';
import { fetchTypeById } from '../typeHelpers';

_.mixin(require('lodash-inflection'));

var { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, context) => {
    var { type, id } = fromGlobalId(globalId);
    return fetchTypeById(
      type, id, context, 'node'
    ).catch(
      catchUnauthorized(context.rootValue)
    );
  },
  ({ instance }) => {
    var singular = _.singularize(instance.type);
    var typeFile = `../types/${_.upperFirst(_.camelCase(singular))}.js`;
    return require(typeFile).type;
  }
);

export { nodeInterface, nodeField };
