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

export default getFieldNamesFromContext;
