import AttributesType from '../AttributesType';

function buildAttributesField(name, type, attrs) {
  if (Object.keys(attrs).length === 0) {
    return {};
  }
  return {
    attributes: {
      type: new AttributesType(name, type, attrs)
    }
  };
}

export default buildAttributesField;
