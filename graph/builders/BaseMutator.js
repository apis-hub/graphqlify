import resolveMaybeThunk from '../helpers/resolveMaybeThunk';

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

  get inputFields() {
    return resolveMaybeThunk(this.options.inputFields);
  }

  get name() {
    return this.type.name;
  }

  get options() {
    return {
      attributes: {},
      inputFields: {},
      outputFields: {},
      ...resolveMaybeThunk(this.config.options)
    };
  }

  get outputFields() {
    return resolveMaybeThunk(this.options.outputFields);
  }

  get resource() {
    return this.options.type.resource;
  }

  get type() {
    return resolveMaybeThunk(this.options.type).type;
  }

}

export default BaseMutator;
