import resolveMaybeThunk from '../../helpers/resolveMaybeThunk';

class ConfigObject {
  constructor(config, defaults = {}) {
    config = resolveMaybeThunk(config);
    // Assign Defaults first
    Object.assign(this, defaults);

    // Apply config to defaults
    Object.keys(config).forEach(key => {
      let value = config[key];
      this[key] = this[key] ? Object.assign(this[key], value) : value;
    });

    // Freeze
    Object.freeze(this);
  }
}

export default ConfigObject;
