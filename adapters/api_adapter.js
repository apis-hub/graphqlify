import fromGlobalId from 'graphql-relay';
import { baseUrl, options} from './config';
import pluralize from 'pluralize';
import decamelize from 'decamelize';
import _ from 'lodash';
import JSONAPIonify from 'jsonapionify-client';
import crypto from 'crypto';

_.mixin({
    'sortKeysBy': function (obj, comparator) {
        var keys = _.sortBy(_.keys(obj), function (key) {
            return comparator ? comparator(obj[key], key) : key;
        });

        return _.object(keys, _.map(keys, function (key) {
            return obj[key];
        }));
    }
});

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
        options      = options || {};
        this.jsonapi = new JSONAPIonify(endpoint, options);
        this.jsonapi.beforeRequest(function (method, path, headers, body) {
            var sig_document = JSON.stringify({
                request_method: method,
                url:            path,
                headers:        _.sortKeysBy(_.reduce(headers, (result, value, key) => {
                    result[key.toLowerCase()] = value;
                    return result
                }, {})),
                body:           body || ""
            });
            console.log(sig_document);
            headers['x-signature'] = crypto.createHmac('sha256', process.env.BRANDFOLDER_API_SHARED_SECRET || 'NONE').update(sig_document).digest('hex');
        });
    }

    getType(type) {
        var adapter = this;
        return {
            all:  () => {
                return new Promise(function (resolve, reject) {
                    adapter.jsonapi.resource(type).index().then(function (collection) {
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
            },
            //delete: (id) => {
            //    return new Promise(function (resolve, reject) {
            //       adapter.jsonapi.resource(type).read(id).then(function (instance) {
            //           resolve(instance.delete(id).then(function(){
            //               // What should the response be here?
            //           });
            //       }).catch(reject);
            //    });
            //},
            //
            //create: (record) => {
            //    return new Promise(function (resolve, reject) {
            //        adapter.jsonapi.resource(type).create(record).then(function (instance) {
            //            resolve(new GraphQLifiedJsonAPIInstance(instance))
            //        }).catch(reject);
            //    });
            //},
            //update: (id, record) => {
            //    return new Promise(function (resolve, reject) {
            //        adapter.jsonapi.resource(type).read(id).then(function (instance) {
            //            resolve(instance.update(record).then(function(instance) {
            //                resolve(new GraphQLifiedJsonAPIInstance(instace));
            //            }))
            //        }).catch(reject);
            //    })
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