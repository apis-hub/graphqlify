import _ from 'lodash';
import * as types from '../types/standard';
import { connectionArgs, globalIdField, connectionDefinitions } from 'graphql-relay';
import { nodeInterface } from '../interfaces/node';
import { apiResourceInterface } from '../interfaces/apiResource';
import { catchUnauthorized } from './catchErrors';
import { getRelatedWithFields, connectionFromRelatesToMany } from './connectionHelpers';

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

function buildRights() {
  return {
    rights: {
      type: types.GraphQLReusableObject,
      resolve: ({ instance }) => {
        return instance.meta.rights;
      }
    }
  };
}

function buildFields(name, mapping) {
  if (mapping instanceof Function) {
    mapping = mapping();
  }
  return _.extend(
    buildId(name),
    buildApiInfo(),
    buildRights(),
    buildAttributes(mapping.attributes),
    buildRelatesToOne(mapping.relatesToOne),
    buildRelatesToMany(mapping.relatesToMany)
  );
}

function buildId(name) {
  return {
    id: globalIdField(name, ({ instance }) => instance.id)
  };
}

function buildAttributes(mapping) {
  mapping = mapping || {};
  let output = {};
  Object.keys(mapping).forEach(attr => {
    let type = mapping[attr];
    output[attr] = {
      type,
      resolve: ({ instance }) => {
        return instance.attributes[attr];
      }
    };
  });
  return output;
}

function buildRelatesToOne(mapping) {
  mapping = mapping || {};
  let output = {};
  Object.keys(mapping).forEach(relationshipName => {
    let type = mapping[relationshipName];
    output[relationshipName] = {
      type,
      resolve: ({ instance }, args, context) => {
        return getRelatedWithFields(
          instance, relationshipName, {}, context
        ).catch(catchUnauthorized(context.rootValue));
      }
    };
  });
  return output;
}

function buildRelatesToMany(mapping) {
  mapping = mapping || {};
  let output = {};
  Object.keys(mapping).forEach(relationshipName => {
    let type = mapping[relationshipName];
    output[relationshipName] = {
      type,
      args: connectionArgs,
      resolve: ({ instance }, args, context) => {
        return connectionFromRelatesToMany(
          instance, relationshipName, args, context
        ).catch(catchUnauthorized(context.rootValue));
      }
    };
  });
  return output;
}

function buildResourceType(name, mapping, ...interfaces) {
  let connectionName = _.pluralize(name);
  let resource = _.pluralize(_.snakeCase(name));
  let type = new types.GraphQLObjectType({
    name,
    fields: () => buildFields(name, mapping),
    interfaces: [ nodeInterface, apiResourceInterface ].concat(...interfaces)
  });

  let { connectionType, edgeType } = connectionDefinitions({
    connectionFields: {
      rights: {
        type: types.GraphQLReusableObject
      }
    },
    name: connectionName,
    nodeType: type
  });

  return { type, connectionType, edgeType, resource };
}

export default buildResourceType;
