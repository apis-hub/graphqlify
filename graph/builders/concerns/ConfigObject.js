import resolveMaybeThunk from '../../helpers/resolveMaybeThunk';

class ConfigObject {
  constructor(config, defaults = {}) {
    config = resolveMaybeThunk(config);
    defaults = resolveMaybeThunk(defaults);
    // Assign Defaults first
    let allKeys = Object.keys(Object.assign({}, defaults, config));
    allKeys.forEach(key => {
      Object.defineProperty(this, key, { get: () => {
        let defaultValue = resolveMaybeThunk(defaults[key]);
        let configValue = resolveMaybeThunk(config[key]);
        if (defaultValue) {
          return Object.assign(defaultValue, configValue);
        }
        return configValue || defaultValue;
      } });
    });

    // Freeze
    Object.freeze(this);
  }
}

export default ConfigObject;
