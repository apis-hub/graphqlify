import * as types from '../types/standard';

import expandInputTypes from './concerns/expandInputTypes';

export default class ParamsType extends types.GraphQLInputObjectType {
  constructor(name, { fields, description }) {
    super({
      name: `${name}Params`,
      description,
      fields: expandInputTypes(fields)
    });
  }
}
