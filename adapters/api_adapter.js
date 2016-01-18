import fromGlobalId from 'graphql-relay';
import { baseUrl, options} from './config';
import pluralize from 'pluralize';
import decamelize from 'decamelize';
import _ from 'lodash';
import JSONAPIonify from 'jsonapionify-client';

class GraphQLifiedJsonAPIInstance {
    constructor(json_api_instance) {
        this.__api = json_api_instance;
        _.extend(this, { id: this.__api.id() }, this.__api.attributes())
    }

    __related(name) {
        var instance = this;
        return new Promise(function (resolve, reject) {
            instance.__api.related(name).then(function (objOrAry) {
                if (objOrAry instanceof Array) {
                    resolve(objOrAry.map(function (instance) {
                        return new GraphQLifiedJsonAPIInstance(instance)
                    }));
                } else if (objOrAry instanceof Object) {
                    resolve(new GraphQLifiedJsonAPIInstance(objOrAry));
                }
            }).catch(reject);
        });
    }
}

class APIAdapter {
    constructor(endpoint, options) {
        this.jsonapi = new JSONAPIonify(endpoint, options);
    }

    getType(type) {
        var adapter = this;
        return {
            all:  () => {
                return new Promise(function (resolve, reject) {
                    adapter.jsonapi.resource(type).index().then(function (collection) {
                        debugger;
                        resolve(collection.map(function (instance) {
                            return new GraphQLifiedJsonAPIInstance(instance)
                        }));
                    }).catch(reject);
                });
            },
            find: (id) => {
                return new Promise(function (resolve, reject) {
                    adapter.jsonapi.resource(type).read(id).then(function (instance) {
                        resolve(new GraphQLifiedJsonAPIInstance(instance))
                    }).catch(reject);
                });
            }
            //delete: (id) => {
            //    var url = baseUrl + '/' + `${endpoint}/${id}`;
            //    requestify.delete(url, options).then(function (response) {
            //        return response.getCode();
            //    });
            //},
            //create: (record) => {
            //    var url = baseUrl + '/' + endpoint;
            //    requestify.post(url, record, options).then(function (response) {
            //        return JSON.parse(response.body);
            //    });
            //},
            //update: (id, record) => {
            //    var url = baseUrl + `${endpoint}/${id}`;
            //    options.method = 'PATCH';
            //    options.body = body;
            //    requestify.request(url, record, options).then(function (response) {
            //        return JSON.parse(response.body);
            //    });
            //}
        }
    }
}

var headers  = {};
var endpoint = process.env.BRANDFOLDER_API_ENDPOINT || 'http://example.org';
var token    = process.env.BRANDFOLDER_API_KEY;

if (token) {
    headers.Authorization = `JWT ${token}`
}

export default new APIAdapter(endpoint, { headers: headers });