import _ from 'lodash';

import { parseOptions } from './apiHelpers';
import { getFieldNamesFromContext, paramsFromContext } from './contextHelpers';

function connectionArgsToParams(args) {
  let { order, after, before, first, last } = args;
  let params = _.omit(args, [ 'order', 'after', 'before', 'first', 'last' ]);
  params.sort = order || 'id';
  if (after || before || first || last) {
    params.page = _.omitBy({ after, before, first, last }, _.isUndefined);
  }
  return params;
}

// Builds a GraphQL Connection from an API relationship
function connectionFromRelatesToMany(parentObj, relName, args, context) {
  let params = connectionArgsToParams(args);

  // If there are no edges, make a request for 0 items
  if (getFieldNamesFromContext(context, relName).indexOf('edges') === -1) {
    return parentObj.related(relName, { page: { first: 0 } }).then(
      collectionToConnection
    );
  }

  // Get the related connection
  return getRelatedWithFields(
    parentObj, relName, params, context, 'edges', 'node'
  ).then(collectionToConnection);
}

// Get a relationship with the fields specified in the context
function getRelatedWithFields(parentObj, relName, params, context, ...path) {
  return parentObj.relatedOptions(relName, params).then(
    parseOptions('GET')
  ).then(
    paramsFromContext(params, context, relName, ...path)
  ).then(
    reqParams => parentObj.related(relName, reqParams)
  );
}

// Gets a connection from a resource index
function connectionFromIndex(resource, args, context) {
  let params = connectionArgsToParams(args);

  // If there are no edges, make a request for 0 items
  if (getFieldNamesFromContext(context, resource).indexOf('edges') === -1) {
    return context.rootValue.api.resource(resource).list(
      { page: { first: 0 } }
    ).then(
      collectionToConnection
    );
  }

  return getIndexWithFields(
    resource, params, context
  ).then(collectionToConnection);
}

// Get the index of a resource  with the fields specified in the context
function getIndexWithFields(resource, params, context, ...path) {
  return context.rootValue.api.resource(resource).options(params).then(
    parseOptions('GET')
  ).then(
    paramsFromContext(params, context, resource, 'edges', 'node')
  ).then(
    reqParams => context.rootValue.api.resource(resource).list(reqParams)
  );
}

// Converts a collection to GraphQL compliant edges
function collectionToEdges(collection) {
  return collection.map(instance => ({
    cursor: instance.meta.cursor,
    node: { instance }
  }));
}

// Converts a collection to GraphQL compliant connection
function collectionToConnection({ collection, response }) {
  return {
    edges: collectionToEdges(collection),
    pageInfo: {
      startCursor: collection.first() && collection.first().meta.cursor,
      endCursor: collection.last() && collection.last().meta.cursor,
      hasPreviousPage: Boolean(collection.links.prev),
      hasNextPage: Boolean(collection.links.next)
    }
  };
}

export {
  collectionToConnection,
  collectionToEdges,
  getRelatedWithFields,
  connectionFromIndex,
  connectionFromRelatesToMany
};
