import _ from 'lodash';
import { nodeDefinitions, fromGlobalId } from 'graphql-relay';

import fetchTypeById from '../helpers/fetchTypeById';
import resolveType from '../helpers/resolveType';

_.mixin(require('lodash-inflection'));

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, { api }, resolveInfo) => {
    let { type, id } = fromGlobalId(globalId);
    type = _.pluralize(_.snakeCase(type));
    return fetchTypeById(
      type, id, api, resolveInfo, {}, [ 'node' ]
    );
  },
  resolveType
);

export { nodeInterface, nodeField };
