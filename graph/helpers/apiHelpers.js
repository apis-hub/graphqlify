function parseOptions(verb) {
  return ({ json }) => {
    var validFields = json.meta.requests[verb].attributes.map(({ name }) => name);
    var validRelationships = json.meta.requests['GET'].relationships.map(({ name }) => name);
    return {
      type: json.meta.type,
      validFields,
      validRelationships
    };
  };
}

export { parseOptions };
