import _ from 'lodash';
import urlJoin from 'url-join';
import {
  connectionArgs as GraphQLConnectionArgs,
  globalIdField,
  connectionDefinitions
} from 'graphql-relay';
import * as types from '../types/standard';
import { apiResourceInterface } from '../interfaces/apiResource';
import { nodeInterface } from '../interfaces/node';
import { catchUnauthorized } from '../helpers/catchErrors';
import expandInputTypes from './concerns/expandInputTypes';
import {
  getRelatedWithFields,
  connectionFromRelatesToMany,
  collectionToConnection
} from '../helpers/connectionHelpers';
import ResourceMappingObject from './concerns/ResourceMappingObject';

const baseUrl = (
  process.env.BRANDFOLDER_API_ENDPOINT || 'https://api.brandfolder.com/v2'
);

function buildApiInfo() {
  return {
    apiId: {
      type: new types.GraphQLNonNull(types.GraphQLString),
      resolve: ({ instance }) => instance.id
    },
    apiType: {
      type: new types.GraphQLNonNull(types.GraphQLString),
      resolve: ({ instance }) => instance.type
    }
  };
}

function buildAttributes({ attributes }) {
  return Object.keys(attributes).reduce((output, attr) => {
    let type = attributes[attr];
    output[attr] = {
      type,
      resolve: ({ instance }) => {
        return instance.attributes[attr];
      }
    };
    return output;
  }, {});
}

function buildFields({ name, mapping, fields }) {
  return {
    ...fields,
    ...buildId(name),
    ...buildApiInfo(),
    ...buildFetchTimestamp(),
    ...buildAttributes(mapping),
    ...buildRelatesToOne(mapping),
    ...buildRelatesToMany(mapping)
  };
}

function buildId(name) {
  return {
    id: globalIdField(name, ({ instance }) => instance.id)
  };
}

function buildFetchTimestamp() {
  return {
    fetchTimestamp: {
      type: new types.GraphQLNonNull(types.GraphQLInt),
      resolve: (obj, args, { rootValue }) => rootValue.timestamp
    }
  };
}

function buildRelatesToOne({ relatesToOne }) {
  return Object.keys(relatesToOne).reduce((output, relationshipName) => {
    let value = relatesToOne[relationshipName];
    let argsMap = {};

    // map/convert the type
    let type;
    if (value instanceof ApiResourceType) {
      type = value.type;
    } else if (value.type instanceof ApiResourceType) {
      type = value.type.type;
      argsMap = { ...(value.args || {}) };
    } else {
      type = value;
    }

    output[relationshipName] = {
      type,
      args: argsMap,
      resolve: ({ instance }, args, context) => {
        return getRelatedWithFields(
          instance, relationshipName, {}, context
        ).catch(catchUnauthorized(context.rootValue));
      }
    };
    return output;
  }, {});
}

function buildRelatesToMany({ relatesToMany }) {
  return Object.keys(relatesToMany).reduce((output, relationshipName) => {
    let value = relatesToMany[relationshipName];
    let argsMap = {};

    // All connections support order
    argsMap.order = {
      type: types.GraphQLString
    };

    // map/convert the type
    let type;
    let typeArgs;
    if (value instanceof ApiResourceType) {
      type = value.connectionType;
      argsMap = { ...argsMap, ...value.buildConnectionArgs() };
    } else if (value.type instanceof ApiResourceType) {
      typeArgs = value.args || {};
      type = value.type.connectionType;
      argsMap = { ...argsMap, ...value.buildConnectionArgs(typeArgs) };
    } else {
      typeArgs = value.args || {};
      type = value.type;
      argsMap = { ...GraphQLConnectionArgs, ...argsMap, ...typeArgs };
    }

    // Return the relationship
    output[relationshipName] = {
      type,
      args: argsMap,
      resolve: ({ instance }, args, context) => {
        return connectionFromRelatesToMany(
          instance, relationshipName, args, context
        ).catch(catchUnauthorized(context.rootValue));
      }
    };
    return output;
  }, {});
}

function buildConnectionFields({ mapping }) {
  return {
    ...mapping.connectionFields,
    ...buildFetchTimestamp()
  };
}

function buildEdgeFields({ mapping }) {
  return {
    ...mapping.edgeFields
  };
}

function buildConnectionDefinitions(resource) {
  return connectionDefinitions({
    edgeFields: () => buildEdgeFields(resource),
    connectionFields: () => buildConnectionFields(resource),
    name: resource.connectionName,
    nodeType: resource.type
  });
}

function buildType(resource) {
  return new types.GraphQLObjectType({
    name: resource.name,
    description: `Fetches ${resource.name} resources from the API. For more
    information see ${urlJoin(baseUrl, `docs#${resource.resource}`)}.`,
    fields: () => buildFields(resource),
    interfaces: resource.interfaces
  });
}

class ApiResourceType {
  constructor(name, mapping, ...interfaces) {
    this.name = name;
    this.resource = _.pluralize(_.snakeCase(this.name));
    this.connectionName = _.pluralize(this.name);
    this.config = Object.freeze({
      mapping,
      interfaces
    });
    this.type = buildType(this);
    this.connectionDefinitions = buildConnectionDefinitions(this);
    Object.freeze(this);
  }

  get interfaces() {
    return [ nodeInterface, apiResourceInterface, ...this.config.interfaces ];
  }

  get connectionType() {
    return this.connectionDefinitions.connectionType;
  }

  get fields() {
    return this.mapping.fields;
  }

  get edgeType() {
    return this.connectionDefinitions.edgeType;
  }

  get attributes() {
    return buildFields(this);
  }

  get connectionStub() {
    return {
      args: this.connectionArgs,
      type: this.connectionType,
      resolve: (obj, args, { rootValue }) => collectionToConnection({
        collection: rootValue.api.resource(this.resource).emptyCollection()
      })
    };
  }

  get mapping() {
    return new ResourceMappingObject(this.config.mapping);
  }

  get connectionArgs() {
    return this.mapping.connectionArgs;
  }

  buildConnectionArgs(args = {}) {
    return expandInputTypes({
      ...this.connectionArgs,
      ...args
    });
  }
}

export default ApiResourceType;
