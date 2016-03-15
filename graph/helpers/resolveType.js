import _ from 'lodash';

_.mixin(require('lodash-inflection'));

function resolveType({ instance }) {
  let singular = _.singularize(instance.type);
  let typeFile = `../types/${_.upperFirst(_.camelCase(singular))}.js`;
  return require(typeFile).type;
}

export default resolveType;
