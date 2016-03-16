function parseOptions(verb) {
  return ({ json }) => {
    let validFields = json.meta.requests[verb].attributes.map(({ name }) => name);
    let validRelationships = json.meta.requests['GET'].relationships.map(({ name }) => name);
    return {
      type: json.meta.type,
      validFields,
      validRelationships
    };
  };
}

export { parseOptions };
