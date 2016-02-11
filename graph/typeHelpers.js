import { connectionArgs, connectionFromPromisedArray, globalIdField, connectionDefinitions } from "graphql-relay";
import _ from "lodash";
import * as types from "./GraphQLTypes";
import { nodeInterface } from "./interfaces/node";
import catchUnauthorized from "../lib/catchUnauthorized";

function buildResourceType(name, mapping, ...interfaces){
  var connectionName = `${name}Connection`
  var type = new types.GraphQLObjectType({
    name: name,
    fields: () => buildFields(name, mapping),
    interfaces: [nodeInterface].concat(...interfaces)
  });

  var {connectionType, edgeType} = connectionDefinitions({
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
  var output = {};
  Object.keys(mapping).forEach((attr) => {
    var name = attr
    var type = mapping[attr]
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
  var output = {};
  Object.keys(mapping).forEach((relationshipName) => {
    var type = mapping[relationshipName]
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
  var output = {};
  Object.keys(mapping).forEach((relationshipName) => {
    var type = mapping[relationshipName]
    output[relationshipName] = {
      type: type,
      args: connectionArgs,
      resolve: (obj, args, context) => connectionFromPromisedArray(obj.related(relationshipName).catch(catchUnauthorized(context.rootValue)), args)
    }
  })
  return output
}

export { buildResourceType, buildFields, buildId, buildAttributes, buildRelatesToOne, buildRelatesToMany}
