function getFieldNamesFromContext(context, names = []) {
  // Dive down into the AST until the final name is reached
  let dive = (asts, depth, fieldNames = []) => {
    let name = names[depth];
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
  let expand = (asts, fields = []) => {
    asts.forEach(f => {
      switch (f.kind) {
        // If the name is a field, just return the field
        case 'Field':
          fields.push(f);
          break;
        // If the name is an InlineFragment, then expand the fragment
        case 'InlineFragment':
          expand(f.selectionSet.selections, fields);
          break;
        // If the name is a fragment, then expand the fragment
        case 'FragmentSpread':
          expand(
            context.fragments[f.name.value].selectionSet.selections, fields
          );
          break;
      }
    });
    return fields;
  };

  // Start diving from the given node
  return dive(context.fieldASTs, 0);
}

function paramsFromContext(existingParams, context, path = []) {
  return ({ type, validFields, validRelationships }) => {
    let params = { ...existingParams };
    let contextFieldNames = getFieldNamesFromContext(context, path);
    let relationships = contextFieldNames.filter(
      name => validRelationships.indexOf(name) > -1
    );
    params['include-relationships'] = Boolean(relationships.length);
    params.fields = {};
    params.fields[type] = contextFieldNames.filter(
      name => validFields.indexOf(name) > -1
    ).join(',');
    return params;
  };
}

export { paramsFromContext, getFieldNamesFromContext };
