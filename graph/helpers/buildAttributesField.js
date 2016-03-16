function buildAttributesField(name, attrs, klass) {
  if (Object.keys(attrs).length === 0) {
    return {};
  }
  return {
    attributes: {
      type: new klass(name, attrs)
    }
  };
}

export default buildAttributesField;
