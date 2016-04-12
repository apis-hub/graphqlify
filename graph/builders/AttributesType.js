import * as types from '../types/standard';

import _ from 'lodash';

import expandInputTypes from './concerns/expandInputTypes';

class AttributesType extends types.GraphQLInputObjectType {
  constructor(name, type, fields) {
    super({
      name: _.camelCase(`${name}_${type}_attributes`),
      fields: expandInputTypes(fields)
    });
  }
}

export default AttributesType;
