import * as types from '../types/standard';

import _ from 'lodash';
import {
  connectionArgs as GraphQLConnectionArgs,
  globalIdField,
  connectionDefinitions
} from 'graphql-relay';

import expandInputTypes from './concerns/expandInputTypes';
import resolveType from '../helpers/resolveType';
import ApiResourceType from './ApiResourceType';
import ConfigObject from './concerns/ConfigObject';
import { nodeInterface } from '../interfaces/node';

_.mixin(require('lodash-inflection'));

function buildApiInfo() {
  return {
    apiId: {
      type: new types.GraphQLNonNull(types.GraphQLString)
    },
    apiType: {
      type: new types.GraphQLNonNull(types.GraphQLString)
    }
  };
}

function buildAttributes({ attributes }) {
  return Object.keys(attributes).reduce((output, attr) => {
    let type = attributes[attr];
    output[attr] = {
      type
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
      args: argsMap
    };
    return output;
  }, {});
}

function buildRelatesToMany({ relatesToMany }) {
  return Object.keys(relatesToMany).reduce((output, relationshipName) => {
    let value = relatesToMany[relationshipName];
    let argsMap = {};
    let type;
    let typeArgs;

    // The value is directly an ApiResourceType
    if (value instanceof ApiResourceType) {
      type = value.connectionType;
      argsMap = value.buildConnectionArgs();

    // The value is nested under a object with type and args keys
    // and is an ApiResourceType
    } else if (value.type instanceof ApiResourceType) {
      typeArgs = value.args || {};
      type = value.type.connectionType;
      argsMap = value.buildConnectionArgs(typeArgs);

    // The value is a basic object
    } else {
      typeArgs = value.args || {};
      type = value.type;
      argsMap = { ...GraphQLConnectionArgs, ...typeArgs };
    }

    // Return the relationship
    output[relationshipName] = {
      type,
      args: argsMap
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

function buildInterface(iface) {
  return new types.GraphQLInterfaceType({
    name: iface.name,
    fields: () => buildFields(iface),
    resolveType
  });
}

class ApiInterfaceType {
  constructor(name, mapping) {
    this.name = name;
    this.resource = _.pluralize(_.snakeCase(this.name));
    this.connectionName = _.pluralize(this.name);
    this.config = Object.freeze({
      mapping
    });
    this.iface = buildInterface(this);
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
      type: this.connectionType
    };
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
      fields: {},
      edgeFields: {},
      connectionFields: {},
      relatesToMany: {},
      relatesToOne: {},
    });
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

export default ApiInterfaceType;
