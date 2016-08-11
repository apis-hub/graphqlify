import * as types from '../types/standard';

import _ from 'lodash';

import expandTypes from '../helpers/expandTypes';

class Attributes extends types.GraphQLInputObjectType {
  constructor(name, type, fields) {
    super({
      name: _.camelCase(`${name}_${type}_attributes`),
      fields: expandTypes(fields)
    });
  }
}

export default Attributes;
