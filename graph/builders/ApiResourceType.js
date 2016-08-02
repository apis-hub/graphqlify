import * as types from '../types/standard';

import _ from 'lodash';
import urlJoin from 'url-join';
import {
  connectionArgs as GraphQLConnectionArgs,
  globalIdField,
  connectionDefinitions
} from 'graphql-relay';

import expandTypes from '../helpers/expandTypes';
import fetchTypeById from '../helpers/fetchTypeById';
import ConfigObject from './concerns/ConfigObject';
import {
  getRelatedWithFields,
  connectionFromRelatesToMany,
  collectionToConnection,
  connectionFromIndex
} from '../helpers/connectionHelpers';
import { nodeInterface } from '../interfaces/node';

_.mixin(require('lodash-inflection'));

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
      resolve: obj => {
        const { instance } = obj;
        return instance.attributes[attr];
      }
    };
    return output;
  }, {});
}

function buildFields({ name, mapping }) {
  return {
    ...mapping.fields,
    ...buildId(name),
    ...buildApiInfo(),
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

function buildRelatesToOne({ relatesToOne }) {
  return Object.keys(relatesToOne).reduce((output, relationshipName) => {
    let value = relatesToOne[relationshipName];
    let argsMap = {};
    let beforeRequest;

    // map/convert the type
    let type;
    if (value instanceof ApiResourceType) {
      type = value.type;
      beforeRequest = value.mapping.beforeRequest;
    } else if (value.type instanceof ApiResourceType) {
      type = value.type.type;
      beforeRequest = value.type.mapping.beforeRequest;
      argsMap = { ...(value.args || {}) };
    } else {
      type = value;
      beforeRequest = () => {};
    }

    output[relationshipName] = {
      type,
      args: argsMap,
      resolve: ({ instance }, args, context, resolveInfo) => {
        beforeRequest(instance, args, context, resolveInfo);
        return getRelatedWithFields(
          instance, relationshipName, {}, resolveInfo
        );
      }
    };
    return output;
  }, {});
}

function buildRelatesToMany({ relatesToMany }) {
  return Object.keys(relatesToMany).reduce((output, relationshipName) => {
    let value = relatesToMany[relationshipName];
    let argsMap = {};
    let beforeRequest;
    let type;
    let typeArgs;

    // The value is directly an ApiResourceType
    if (value instanceof ApiResourceType) {
      type = value.connectionType;
      beforeRequest = value.mapping.beforeRequest;
      argsMap = value.buildConnectionArgs();

    // The value is nested under a object with type and args keys
    // and is an ApiResourceType
    } else if (value.type instanceof ApiResourceType) {
      typeArgs = value.args || {};
      type = value.type.connectionType;
      beforeRequest = value.type.mapping.beforeRequest;
      argsMap = value.buildConnectionArgs(typeArgs);

    // The value is a basic object
    } else {
      typeArgs = value.args || {};
      type = value.type;
      beforeRequest = () => {};
      argsMap = { ...GraphQLConnectionArgs, ...typeArgs };
    }

    // Return the relationship
    output[relationshipName] = {
      type,
      args: argsMap,
      resolve: ({ instance }, args, context, resolveInfo) => {
        beforeRequest(instance, args, context, resolveInfo);
        return connectionFromRelatesToMany(
          instance, relationshipName, args, resolveInfo
        );
      }
    };
    return output;
  }, {});
}

function buildConnectionFields({ mapping }) {
  return {
    ...mapping.connectionFields
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

  get singularName() {
    return _.singularize(this.name);
  }

  get interfaces() {
    return [ nodeInterface, ...this.config.interfaces ];
  }

  get connectionType() {
    return this.connectionDefinitions.connectionType;
  }

  get fields() {
    return buildFields(this);
  }

  get edgeType() {
    return this.connectionDefinitions.edgeType;
  }

  get attributes() {
    return this.mapping.attributes;
  }

  get connectionStub() {
    return {
      args: this.connectionArgs,
      type: this.connectionType,
      resolve: (obj, args, { api }) => collectionToConnection({
        collection: api.resource(this.resource).emptyCollection()
      })
    };
  }

  indexFieldAs(name) {
    let object = {};
    object[this.resource] = {
      args: this.connectionArgs,
      type: this.connectionType,
      resolve: (indexField, args, context, resolveInfo) => {
        this.mapping.beforeRequest(indexField, args, context, resolveInfo);
        return connectionFromIndex(this.resource, args, context.api, resolveInfo, [ name ]);
      }
    };
    return object;
  }

  get indexField() {
    return this.indexFieldAs(this.resource);
  }

  instanceFieldAs(name, { apiId: defaultApiId } = {}) {
    let object = {};
    let contextPath = [ name ];
    object[name] = {
      type: this.type,
      resolve: (rootValue, { apiId }, context, resolveInfo) => {
        let params = {};
        this.mapping.beforeRequest(rootValue, params, context, resolveInfo);
        return fetchTypeById(
          this.resource, apiId || defaultApiId, context.api, resolveInfo, params, contextPath
        );
      }
    };
    if (!defaultApiId) {
      object[name].args = {
        apiId: {
          description: `The api id of the ${this.singularName}.`,
          type: new types.GraphQLNonNull(types.GraphQLString)
        }
      };
    }
    return object;
  }

  get instanceField() {
    let singularName = _.snakeCase(this.singularName);
    return this.instanceFieldAs(singularName);
  }

  get mapping() {
    return new ConfigObject(this.config.mapping, {
      attributes: {
        ...require('../types/concerns/basicPermissions')
      },
      connectionArgs: {
        sort: {
          description: 'Specifies the sort of the results',
          type: types.GraphQLString,
        },
        ...GraphQLConnectionArgs
      },
      beforeRequest: () => {},
      fields: {},
      edgeFields: {},
      connectionFields: {
        total_count: {
          type: new types.GraphQLNonNull(types.GraphQLInt)
        }
      },
      relatesToMany: {},
      relatesToOne: {},
    });
  }

  get connectionArgs() {
    return this.mapping.connectionArgs;
  }

  buildConnectionArgs(args = {}) {
    return expandTypes({
      ...this.connectionArgs,
      ...args
    });
  }
}

export default ApiResourceType;
