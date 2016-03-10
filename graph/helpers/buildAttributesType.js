import _ from 'lodash';
import * as types from '../types/standard';

// Build the input type for attributes
function buildAttributesType(name, fields) {
  // Force shorthand into longhand
  _.reduce(fields, (result, value, key) => {
    if (result[key].type === undefined) {
      result[key] = { type: value };
    }
    return result;
  }, fields);

  return {
    createAttributesType: new types.GraphQLInputObjectType({
      name: `${name}CreateAttributes`,
      fields
    }),
    updateAttributesType: new types.GraphQLInputObjectType({
      name: `${name}UpdateAttributes`,
      fields: _.reduce(fields, (result, field) => {
        if (field.type instanceof types.GraphQLNonNull) {
          field.type = field.type.ofType;
        }
        return result;
      }, fields)
    })
  };
}

export default buildAttributesType;
