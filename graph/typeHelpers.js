import { connectionArgs, connectionFromPromisedArray, globalIdField, connectionDefinitions, cursorToOffset } from "graphql-relay";
import _ from "lodash";
import * as types from "./GraphQLTypes";
import { nodeInterface } from "./interfaces/node";
import { catchUnauthorized } from "../lib/catchUnauthorized";
_.mixin(require("lodash-inflection"));

function buildResourceType(name, mapping, ...interfaces){
  let connectionName = _.pluralize(name)
  let type = new types.GraphQLObjectType({
    name: name,
    fields: () => buildFields(name, mapping),
    interfaces: [nodeInterface].concat(...interfaces)
  });

  let {connectionType, edgeType} = connectionDefinitions({
    name: connectionName,
    nodeType: type
  });

  return {type, connectionType, edgeType}
}

function buildFields(name, mapping) {
  if (mapping instanceof Function){
    mapping = mapping()
  }
  return _.extend(
    buildId(name),
    buildAttributes(mapping.attributes),
    buildRelatesToOne(mapping.relatesToOne),
    buildRelatesToMany(mapping.relatesToMany)
  )
}

function buildId(name){
  return { id: globalIdField(name, (obj) => obj.id()) }
}

function buildAttributes(mapping) {
  mapping = mapping || {};
  let output = {};
  Object.keys(mapping).forEach((attr) => {
    let name = attr
    let type = mapping[attr]
    output[attr] = {
      type: type,
      resolve: (obj) => {
        return obj.attribute(attr)
      }
    }
  })
  return output;
}

function buildRelatesToOne(mapping) {
  mapping = mapping || {};
  let output = {};
  Object.keys(mapping).forEach((relationshipName) => {
    let type = mapping[relationshipName]
    output[relationshipName] = {
      type: type,
      resolve: (obj, args, context) => {
        return obj.related(relationshipName).catch(catchUnauthorized(context.rootValue))
      }
    }
  })
  return output;
}

function buildRelatesToMany(mapping) {
  mapping = mapping || {};
  let output = {};
  Object.keys(mapping).forEach((relationshipName) => {
    let type = mapping[relationshipName]
    output[relationshipName] = {
      type: type,
      args: connectionArgs,
      resolve: (obj, args, context) => connectionFromRelatesToMany(
        obj, relationshipName, args
      ).catch(catchUnauthorized(context.rootValue))
    }
  })
  return output
}

function connectionFromRelatesToMany(parentObj, relationshipName, { order, after, before, first, last }){
  order = order || 'id'
  let params = {}

  params.sort = order

  if (after || before || first || last){
    params.page = {}

    for (let [k, v] of { after, before, first, last }){
      if (v){
        params.page[k] = v
      }
    }
  }

  params['include-relationships'] = true
  return parentObj.related(relationshipName, params).then((collection)=>{
    return {
      edges: collection.map((node) => { return { cursor: node.meta['cursor'], node: node } }),
      pageInfo: {
        startCursor: '',
        endCursor: '',
        hasPreviousPage: !!collection.link('prev'),
        hasNextPage: !!collection.link('next')
      }
    }
  })
}

export { buildResourceType, buildFields, buildId, buildAttributes, buildRelatesToOne, buildRelatesToMany, connectionFromRelatesToMany }
