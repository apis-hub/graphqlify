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


function rejectWithGraphQL(fn){ 
    return function(jsonapiError) { 
        if (!typeof error instanceof Array){ 
            return error 
        } 
        var reason = jsonapiError.map(function (error) { 
            var message =  `${error.status} ${error.title}`; 
            if (error.detail){ 
                message += `: ${error.detail}` 
            } 
            return message 
        }).join(', '); 
        fn(reason) 
    } 
}


class GraphQLifiedJsonAPIResource extends JSONAPIonifyResource {
    constructor(name, client) {
        super(name, client);
    }

    index() {
        var superPromise = super.index();
        return new Promise(function(resolve, reject) {
            superPromise.then(function (jsonAPICollection) {
                resolve (new GraphQLifiedJsonAPICollection(jsonAPICollection.responseJson, jsonAPICollection.client));
            }).catch(rejectWithGraphQL(reject));
        })
    }

    create(data) {
        var superPromise = super.create(data);
        return new Promise(function(resolve, reject) {
            superPromise.then(function (jsonAPIInstance) {
                resolve (new GraphQLifiedJsonAPIInstance(jsonAPIInstance.data, jsonAPIInstance.client).graphQLObject())
            }).catch(rejectWithGraphQL(reject));
        })
    }

    read(id) {
        var outerInstance = this;
        var superPromise = super.read(id);
;
        return new Promise(function(resolve, reject) {
            var innerInstance = outerInstance;
            superPromise.then(function (jsonAPIInstance) {
                resolve (new GraphQLifiedJsonAPIInstance(jsonAPIInstance.data, jsonAPIInstance.client).graphQLObject())
            }).catch(rejectWithGraphQL(reject));
        })
    }

}

class GraphQLifiedJsonAPIInstance extends JSONAPIonifyInstance  {
    constructor(data, client) {
        super(data, client);
    }

    graphQLObject(){
        return _.extend({ __api__: this, id: this.id() }, this.attributes())
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
            }).catch(rejectWithGraphQL(reject));
        })
    }

    save() {
        var superPromise = super.save();
debugger;
        return new Promise(function(resolve, reject) {
            superPromise.then(function (jsonAPIInstance) {
                debugger;
                resolve (new GraphQLifiedJsonAPIInstance(jsonAPIInstance.data, jsonAPIInstance.client).graphQLObject())
            }).catch(rejectWithGraphQL(reject));
        })
    }
}

class GraphQLifiedJsonAPICollection extends JSONAPIonifyCollection {
    constructor(responseJson, client) {
        super(responseJson, client);

        while(this.length){
            this.pop()
        }

        var collection = this;
        responseJson.data.forEach(function (data) {
            collection.push(new GraphQLifiedJsonAPIInstance(data, client).graphQLObject());
        });
    }

    create(type, data){
        var superPromise = super.create(type, data);
        return new Promise(function(resolve, reject){
            superPromise.then(function(jsonApiInstance){
                resolve(new GraphQLifiedJsonAPIInstance(jsonApiInstance.data, jsonApiInstance.client).graphQLObject());
            }).catch(rejectWithGraphQL(reject));
        })
    }
}


class GraphQLifiedJsonAPI extends JSONAPIonify {
    constructor(baseUrl, ClientOptions) {
        super(baseUrl, ClientOptions);
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
     headers['x-signature'] = crypto.createHmac('sha256', process.env.BRANDFOLDER_API_SHARED_SECRET || 'NONE').update(sig_document).digest('hex');
};

module.exports = { GraphQLifiedJsonAPI: GraphQLifiedJsonAPI, signRequest: signRequest };