import { GraphQLInputObjectType } from '../types/standard';

import _ from 'lodash';

class Relationships extends GraphQLInputObjectType {
  constructor(name, type, fields) {
    super({
      name: _.camelCase(`${name}_${type}_relationships`),
      fields
    });
  }
}

export default Relationships;
