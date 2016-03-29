import buildAttributesField from './concerns/buildAttributesField';
import buildIdInputField from './concerns/buildIdInputField';
import buildResourceOutputField from './concerns/buildResourceOutputField';
import resolveMaybeThunk from '../helpers/resolveMaybeThunk';
import types from '../types/standard';
import { CreateAttributesType } from './AttributeTypes';

function buildDeletedIdField({ type }) {
  let outputFields = {};
  outputFields[`deleted${type.name}Id`] = {
    type: new types.GraphQLNonNull(types.GraphQLID),
    resolve: ({ deletedId }) => deletedId
  };
  return outputFields;
}

class BaseMutator {
  constructor(options) {
    this.config = Object.freeze({ options });
  }

  defProperty(name, ...args) {
    Object.defineProperty(this, name, ...args);
  }

  get attributes() {
    return resolveMaybeThunk(this.options.attributes);
  }

  get name() {
    return this.type.name;
  }

  get options() {
    return {
      attributes: {},
      inputFields: {},
      outputFields: {},
      createInputFields: {},
      createOutputFields: {},
      deleteInputFields: {},
      deleteOutputFields: {},
      ...resolveMaybeThunk(this.config.options)
    };
  }

  get inputFields() {
    return resolveMaybeThunk(this.options.inputFields);
  }

  get outputFields() {
    return resolveMaybeThunk(this.options.outputFields);
  }

  get createInputFields() {
    return {
      ...this.inputFields,
      ...resolveMaybeThunk(this.options.createInputFields),
      ...buildAttributesField(this.name, this.attributes, CreateAttributesType)
    };
  }

  get createOutputFields() {
    return {
      ...this.outputFields,
      ...resolveMaybeThunk(this.options.createOutputFields),
      ...buildResourceOutputField(this, 'created')
    };
  }

  get deleteInputFields() {
    return {
      ...this.inputFields,
      ...resolveMaybeThunk(this.options.deleteInputFields),
      ...buildIdInputField(),
    };
  }

  get deleteOutputFields() {
    return {
      ...this.outputFields,
      ...resolveMaybeThunk(this.options.deleteOutputFields),
      ...buildDeletedIdField(this),
      ...buildResourceOutputField(this, 'deleted'),
    };
  }

  get resource() {
    return resolveMaybeThunk(this.options.type).resource;
  }

  get type() {
    return resolveMaybeThunk(this.options.type).type;
  }

}

export default BaseMutator;
