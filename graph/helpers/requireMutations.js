import _ from 'lodash';

import { lazyPickBy } from './lazy';

function requireMutations(file) {
  let prefixes = [ 'create', 'update', 'delete', 'add', 'remove', 'replace' ];
  return lazyPickBy(require(`../mutations/${file}`), name => {
    return prefixes.find(prefix => _.startsWith(name, prefix)) !== undefined;
  });
}

export default requireMutations;
