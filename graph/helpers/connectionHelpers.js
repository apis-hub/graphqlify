import _ from 'lodash';

import { parseResponseOptions } from './apiHelpers';
import { getFieldNamesFromResolveInfo, paramsFromResolveInfo } from './contextHelpers';

function connectionArgsToParams(args) {
  let { after, before, first, last } = args;
  let params = _.omit(args, [ 'after', 'before', 'first', 'last' ]);
  if (after || before || first || last) {
    params.page = _.omitBy({ after, before, first, last }, _.isUndefined);
  }
  return params;
}

// Builds a GraphQL Connection from an API relationship
function connectionFromRelatesToMany(parentObj, relName, args, resolveInfo) {
  let params = connectionArgsToParams(args);

  // If there are no edges, make a request for 0 items
  if (getFieldNamesFromResolveInfo(resolveInfo, [ relName ]).indexOf('edges') === -1) {
    return parentObj.related(relName, { page: { first: 0 } }).then(
      collectionToConnection
    );
  }

  // Get the related connection
  return getRelatedWithFields(
    parentObj, relName, params, resolveInfo, [ 'edges', 'node' ]
  ).then(collectionToConnection);
}

// Get a relationship with the fields specified in the resolveInfo
function getRelatedWithFields(parentObj, relName, params, resolveInfo, path = []) {
  return parentObj.relatedOptions(relName, params).then(
    parseResponseOptions('GET')
  ).then(
    paramsFromResolveInfo(params, resolveInfo, [ relName, ...path ])
  ).then(
    reqParams => parentObj.related(relName, reqParams)
  );
}

// Gets a connection from a resource index
function connectionFromIndex(resource, args, api, resolveInfo, path) {
  let params = connectionArgsToParams(args);
  path = path || [ resource ];

  // If there are no edges, make a request for 0 items
  if (getFieldNamesFromResolveInfo(resolveInfo, path).indexOf('edges') === -1) {
    return api.resource(resource).list(
      { page: { first: 0 } }
    ).then(
      collectionToConnection
    );
  }

  return getIndexWithFields(
    resource, params, api, resolveInfo
  ).then(collectionToConnection);
}

// Get the index of a resource  with the fields specified in the context
function getIndexWithFields(resource, params, api, resolveInfo, path) {
  path = path || [ resource ];
  return api.resource(resource).options(params).then(
    parseResponseOptions('GET')
  ).then(
    paramsFromResolveInfo(params, resolveInfo, [ ...path, 'edges', 'node' ])
  ).then(
    reqParams => api.resource(resource).list(reqParams)
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
function collectionToConnection({ collection }) {
  return {
    total_count: collection.meta.total_count,
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
