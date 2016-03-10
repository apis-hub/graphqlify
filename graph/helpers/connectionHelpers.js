import { getFieldNamesFromContext, paramsFromContext } from './contextHelpers';
import { parseOptions } from './apiHelpers';
import _ from 'lodash';

// Builds a GraphQL Connection from an API relationship
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

// Get a relationship with the fields specified in the context
function getRelatedWithFields(parentObj, relationshipName, params, context, ...path) {
  return parentObj.relatedOptions(relationshipName, params).then(
    parseOptions('GET')
  ).then(
    paramsFromContext(params, context, relationshipName, ...path)
  ).then(
    reqParams => parentObj.related(relationshipName, reqParams)
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
    },
    rights: (response && response.json().meta.rights) || {}
  };
}

export {
  collectionToConnection,
  collectionToEdges,
  getRelatedWithFields,
  connectionFromRelatesToMany
};
