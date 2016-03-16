import _ from 'lodash';
import types from '../types/standard';

function expandInputTypes(inputs) {
  // Force shorthand into longhand
  return _.reduce(inputs, (result, value, key) => {
    if (types.isType(value)) {
      result[key] = { type: value };
    }
    return result;
  }, inputs);
}

export default expandInputTypes;
