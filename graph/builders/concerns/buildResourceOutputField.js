import _ from 'lodash';

// Output Field for resource
export default function buildResourceOutputField({ name, type }, prefix) {
  let fields = {};
  fields[_.camelCase(_.compact([ prefix, _.singularize(name) ]).join('_'))] = {
    type,
    resolve: obj => {
      return obj.resultResponse;
    }
  };
  return fields;
}
