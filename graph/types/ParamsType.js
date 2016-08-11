import * as types from '../types/standard';

import expandTypes from '../helpers/expandTypes';

export default class ParamsType extends types.GraphQLInputObjectType {
  constructor(name, { fields, description }) {
    super({
      name: `${name}Params`,
      description,
      fields: expandTypes(fields)
    });
  }
}
