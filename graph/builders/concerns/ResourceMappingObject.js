import { connectionArgs as GraphQLConnectionArgs } from 'graphql-relay';
import resolveMaybeThunk from '../../helpers/resolveMaybeThunk';

class ResourceMappingObject {
  constructor(config) {
    // Set Defaults
    config = {
      connectionArgs: {},
      fields: {},
      edgeFields: {},
      connectionFields: {},
      relatesToMany: {},
      relatesToOne: {},
      ...resolveMaybeThunk(config)
    };

    // Set the variables
    Object.keys(config).forEach(key => {
      let value = config[key];
      this[key] = value;
    });

    // Include the default connection args
    this.connectionArgs = {
      ...GraphQLConnectionArgs,
      ...this.connectionArgs,
    };

    // Freeze
    Object.freeze(this);
  }
}

export default ResourceMappingObject;
