import _ from 'lodash';
import { nodeDefinitions, fromGlobalId } from 'graphql-relay';

import fetchTypeById from '../helpers/fetchTypeById';
import resolveType from '../helpers/resolveType';

_.mixin(require('lodash-inflection'));

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, context) => {
    let { type, id } = fromGlobalId(globalId);
    type = _.pluralize(type.toLowerCase());
    return fetchTypeById(
      type, id, context, {}, 'node'
    );
  },
  resolveType
);

export { nodeInterface, nodeField };
