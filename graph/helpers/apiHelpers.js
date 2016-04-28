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
    let verbOptions = json.meta.requests[verb] || {};
    let { response_attributes: responseAttributes = [], relationships = [] } = verbOptions;
    let validFields = responseAttributes.map(({ name }) => name);
    let validRelationships = relationships.map(({ name }) => name);
    return {
      type: json.meta.type,
      validFields,
      validRelationships
    };
  };
}

export { parseRequestOptions, parseResponseOptions };
