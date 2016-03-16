import _ from 'lodash';
import * as types from '../types/standard';
import expandInputTypes from './concerns/expandInputTypes';

function denullify(fields) {
  return _.reduce(fields, (result, field) => {
    if (field.type instanceof types.GraphQLNonNull) {
      field.type = field.type.ofType;
    }
    return result;
  }, fields);
}

class CreateAttributesType extends types.GraphQLInputObjectType {
  constructor(name, fields) {
    super({
      name: `${name}CreateAttributes`,
      fields: expandInputTypes(fields)
    });
  }
}

class UpdateAttributesType extends types.GraphQLInputObjectType {
  constructor(name, fields) {
    super({
      name: `${name}UpdateAttributes`,
      fields: denullify(expandInputTypes(fields))
    });
  }
}

export { CreateAttributesType, UpdateAttributesType };
