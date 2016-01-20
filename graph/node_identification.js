import {nodeDefinitions, fromGlobalId} from 'graphql-relay';
import _ from 'lodash';
import _inflection from 'lodash-inflection';
import api from '../adapters/api_adapter';
_.mixin(_inflection);

var {nodeInterface, nodeField} = nodeDefinitions(
    (globalId) => {
        var {type, id} = fromGlobalId(globalId);
        return api.resource(_.pluralize(type)).read(id);
    },
    (obj) => {
        var singular = _.singularize(obj.__api.data.type);
        var typeFile = `./types/${singular}_type.js`;
        var typeKey  = `${_.camelCase(singular)}Type`;
        return require(typeFile)[typeKey];
    }
);

export {nodeInterface, nodeField};