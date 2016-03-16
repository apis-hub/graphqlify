import _ from 'lodash';

function requireMutations(file) {
  let prefixes = [ 'create', 'update', 'delete', 'add', 'remove', 'replace' ];
  return _.pickBy(require(`../mutations/${file}`), (value, name) => {
    return prefixes.find(prefix => _.startsWith(name, prefix)) !== undefined;
  });
}

export default requireMutations;
