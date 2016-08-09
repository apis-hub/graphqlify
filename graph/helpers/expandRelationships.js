 import _ from 'lodash';
import { fromGlobalId } from 'graphql-relay';

_.mixin(require('lodash-inflection'));

function expand(relationship) {
  const { type, id } = fromGlobalId(relationship);
  return {
    type: _.pluralize(_.snakeCase(type)),
    id
  };
}

export default function expandRelationships(relationships) {
  return Object.keys(relationships).reduce((obj, key) => {
    const value = relationships[key];
    obj[key] = { data: value instanceof Array ? value.map(expand) : expand(value) };
    return obj;
  }, {});
}
