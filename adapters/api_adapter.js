"use strict";
var pluralize = require('pluralize');
var decamelize = require('decamelize');
var _ = require('lodash');
var JSONAPIonify = require('jsonapionify-client');
var JSONAPIonifyCollection = require('jsonapionify-client/classes/collection');
var JSONAPIonifyInstance = require('jsonapionify-client/classes/instance');
var JSONAPIonifyResource = require('jsonapionify-client/classes/resource');
var crypto = require('crypto');

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

class GraphQLifiedJsonAPIResource extends JSONAPIonifyResource {
    constructor(name, client) {
        super(name, client);
    }

    index() {
        var superPromise = super.index();
        return new Promise(function(resolve, reject) {
            superPromise.then(function (jsonAPICollection) {
                resolve (new GraphQLifiedJsonAPICollection(jsonAPICollection.responseJson, jsonAPICollection.client));
            }).catch(reject)
        })
    }

    create(data) {
        var superPromise = super.create(data);
        return new Promise(function(resolve, reject) {
            superPromise.then(function (jsonAPIInstance) {
                resolve (new GraphQLifiedJsonAPIInstance(jsonAPIInstance.data, jsonAPIInstance.client).graphQLObject())
            }).catch(reject)
        })
    }

    read(id) {
        var superPromise = super.read(id);
        return new Promise(function(resolve, reject) {
            superPromise.then(function (jsonAPIInstance) {
                resolve (new GraphQLifiedJsonAPIInstance(jsonAPIInstance.data, jsonAPIInstance.client).graphQLObject())
            }).catch(reject)
        })
    }

}

class GraphQLifiedJsonAPIInstance extends JSONAPIonifyInstance  {
    constructor(data, client) {
        super(data, client);
    }

    graphQLObject(){
        return _.extend({ __api__: this, id: this.attribute(id) }, this.attributes())
    }

    related(name) {
        var superPromise = super.related(name);
        return new Promise(function(resolve, reject) {
            superPromise.then(function (objOrAry) {
                if (objOrAry instanceof Array) {
                    resolve(new GraphQLifiedJsonAPICollection(objOrAry.responseJson, objOrAry.client));
                } else if (objOrAry instanceof Object) {
                    resolve(new GraphQLifiedJsonAPIInstance(objOrAry.data, objOrAry.client).graphQLObject());
                }
            }).catch(reject);
        })
    }

    save(params) {
        var superPromise = super.save(params);
        return new Promise(function(resolve, reject) {
            superPromise.then(function (jsonAPIInstance) {
                resolve (new GraphQLifiedJsonAPIInstance(jsonAPIInstance.data, jsonAPIInstance.client).graphQLObject())
            }).catch(reject);
        })
    }
}

class GraphQLifiedJsonAPICollection extends JSONAPIonifyCollection {
    constructor(responseJson, client) {
        super(responseJson, client);
    }

    create(type, data){
        var superPromise = super.create(type, data);
        return new Promise(function(resolve, reject){
            superPromise.then(function(jsonApiInstance){
                resolve(new GraphQLifiedJsonAPIInstance(jsonAPIInstance.data, jsonAPIInstance.client));
            }).catch(reject)
        })
    }
}


class GraphQLifiedJsonAPI extends JSONAPIonify {
    constructor(baseUrl, clientOptions) {
        super(baseUrl, clientOptions);
    }

    resource(name) {
        return new GraphQLifiedJsonAPIResource(name, this.client);
    }
}

var signRequest = function (method, path, headers, body) {
    var sig_document = JSON.stringify({
        request_method: method,
        url:            path,
        headers:        _.sortKeysBy(_.reduce(headers, (result, value, key) => {
            result[key.toLowerCase()] = value;
            return result
        }, {})),
        body:           body || ""
    });
    // headers['x-signature'] = crypto.createHmac('sha256', process.env.BRANDFOLDER_API_SHARED_SECRET || 'NONE').update(sig_document).digest('hex');
};

module.exports = { GraphQLifiedJsonAPI: GraphQLifiedJsonAPI, signRequest: signRequest };