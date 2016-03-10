import _ from 'lodash';

function getFieldNamesFromContext(context, ...names) {
  // Dive down into the AST until the final name is reached
  var dive = (asts, depth, fieldNames = []) => {
    var name = names[depth];
    if (name) {
      // Dive level deeper, if a next name is specified
      expand(asts).filter(o => o.name.value === name).forEach(
        ast => dive(ast.selectionSet.selections, depth + 1, fieldNames)
      );
    } else {
      // Return the actual field names
      expand(asts).forEach(f => {
        if (fieldNames.filter(n => n === f.name.value).length === 0) {
          fieldNames.push(f.name.value);
        }
      });
    }
    return fieldNames;
  };

  // Expand fragments from fields
  var expand = (asts, fields = []) => {
    asts.forEach(f => {
      switch (f.kind) {
        case 'Field': // If the name is a field, just return the field
          fields.push(f);
          break;
        case 'InlineFragment': // If th ename is an InlineFragment, then expand the fragment
          expand(f.selectionSet.selections, fields);
          break;
        case 'FragmentSpread': // If the name is a fragment, then expand the fragment
          expand(context.fragments[f.name.value].selectionSet.selections, fields);
          break;
      }
    });
    return fields;
  };

  // Start diving from the given node
  return dive(context.fieldASTs, 0);
}

function paramsFromContext(existingParams, context, ...path) {
  return ({ type, validFields, validRelationships }) => {
    var params = _.extend({}, existingParams);
    var contextFieldNames = getFieldNamesFromContext(context, ...path);
    var relationships = contextFieldNames.filter(name => validRelationships.indexOf(name) > -1);
    params['include-relationships'] = Boolean(relationships.length);
    params.fields = {};
    params.fields[type] = contextFieldNames.filter(name => validFields.indexOf(name) > -1).join(',');
    return params;
  };
}

export { paramsFromContext, getFieldNamesFromContext };
