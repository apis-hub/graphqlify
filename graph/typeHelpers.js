import { connectionArgs, globalIdField, connectionDefinitions } from 'graphql-relay';
import * as types from './GraphQLTypes';
import getFieldNamesFromContext from '../lib/getFieldNamesFromContext';
import { nodeInterface } from './interfaces/node';
import { apiResourceInterface } from './interfaces/apiResource';
import { catchUnauthorized } from '../lib/catchUnauthorized';
import _ from 'lodash';

function fetchTypeById(type, id, context, nodeName, params = {}) {
  var resource = context.rootValue.api.resource(type);
  return resource.new({ id }).options().then(
    parseOptions('GET')
  ).then(
    buildParams(params, context, nodeName)
  ).then(
    reqParams => resource.read(id, reqParams)
  );
}

function buildResourceType(name, mapping, ...interfaces) {
  let connectionName = _.pluralize(name);
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

  return { type, connectionType, edgeType };
}

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

function connectionFromRelatesToMany(parentObj, relationshipName, { order, after, before, first, last }, context) {
  order = order || 'id';
  let params = {};

  params.sort = order;

  if (after || before || first || last) {
    params.page = _.omitBy({ after, before, first, last }, _.isUndefined);
  }

  if (getFieldNamesFromContext(context, relationshipName).indexOf('edges') === -1) {
    return parentObj.related(relationshipName, { page: { first: 0 } }).then(
      collectionToConnection
    );
  }

  return getRelatedWithFields(
    parentObj, relationshipName, params, context, 'edges', 'node'
  ).then(collectionToConnection);
}

function parseOptions(verb) {
  return ({ json }) => {
    var validFields = json.meta.requests[verb].attributes.map(({ name }) => name);
    var validRelationships = json.meta.requests['GET'].relationships.map(({ name }) => name);
    return {
      type: json.meta.type,
      validFields,
      validRelationships
    };
  };
}

function buildParams(existingParams, context, ...path) {
  return ({ type, validFields, validRelationships }) => {
    var params = _.extend({}, existingParams);
    var contextFieldNames = getFieldNamesFromContext(context, ...path);
    var relationships = contextFieldNames.filter(name => validRelationships.indexOf(name) > -1);
    params['include-relationships'] = Boolean(relationships.length);
    params.fields = {};
    params.fields[type] = contextFieldNames.filter(name => validFields.indexOf(name) > -1).join(',');
    return params;
  };
}

function getRelatedWithFields(parentObj, relationshipName, params, context, ...path) {
  return parentObj.relatedOptions(relationshipName, params).then(
    parseOptions('GET')
  ).then(
    buildParams(params, context, relationshipName, ...path)
  ).then(
    reqParams => parentObj.related(relationshipName, reqParams)
  );
}

function collectionToConnection({ collection, response }) {
  return {
    edges: collection.map(instance => ({ cursor: instance.meta.cursor, node: { instance } } )),
    pageInfo: {
      startCursor: collection.first() && collection.first().meta.cursor,
      endCursor: collection.last() && collection.last().meta.cursor,
      hasPreviousPage: Boolean(collection.links.prev),
      hasNextPage: Boolean(collection.links.next)
    },
    rights: (response && response.json().meta.rights) || {}
  };
}

export {
  fetchTypeById,
  buildResourceType,
  buildFields,
  buildId,
  buildAttributes,
  buildRelatesToOne,
  buildRelatesToMany,
  connectionFromRelatesToMany,
  collectionToConnection
};
