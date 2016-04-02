function parseRequestOptions(verb) {
  return ({ json }) => {
    let validFields =
      json.meta.requests[verb].request_attributes.map(({ name }) => name);
    return {
      type: json.meta.type,
      validFields
    };
  };
}

function parseResponseOptions(verb) {
  return ({ json }) => {
    let validFields =
      json.meta.requests[verb].response_attributes.map(({ name }) => name);
    let validRelationships =
      json.meta.requests['GET'].relationships.map(({ name }) => name);
    return {
      type: json.meta.type,
      validFields,
      validRelationships
    };
  };
}

export { parseRequestOptions, parseResponseOptions };
