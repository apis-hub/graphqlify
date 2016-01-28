"use strict";
var pluralize = require('pluralize');
var decamelize = require('decamelize');
var _ = require('lodash');
var JSONAPIonify = require('JSONAPIonify-client');
var JSONAPIonifyCollection = require('JSONAPIonify-client/classes/collection');
var JSONAPIonifyInstance = require('JSONAPIonify-client/classes/instance');
var JSONAPIonifyResource = require('JSONAPIonify-client/classes/resource');
var crypto = require('crypto');
var processResponse = require('JSONAPIonify-client/helpers/process_response');

_.mixin({
    'sortKeysBy': function (obj, comparator) {
        var keys = _.sortBy(_.keys(obj), function (key) {
            return comparator ? comparator(obj[ key ], key) : key;
        });

        return _.object(keys, _.map(keys, function (key) {
            return obj[ key ];
        }));
    }
});


function rejectWithGraphQL(fn) {
    return function (jsonapiError) {
        if (!typeof error instanceof Array) {
            return error
        }
        var reason = jsonapiError.map(function (error) {
            var message = `${error.status} ${error.title}`;
            if (error.detail) {
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
        return new Promise(function (resolve, reject) {
            superPromise.then(function (jsonAPICollection) {
                resolve(new GraphQLifiedJsonAPICollection(jsonAPICollection.responseJson, jsonAPICollection.client));
            }).catch(rejectWithGraphQL(reject));
        })
    }

    create(data) {
        var superPromise = super.create(data);
        return new Promise(function (resolve, reject) {
            superPromise.then(function (jsonAPIInstance) {
                resolve(new GraphQLifiedJsonAPIInstance(jsonAPIInstance.data, jsonAPIInstance.client).graphQLObject())
            }).catch(rejectWithGraphQL(reject));
        })
    }

    read(id) {
        var superPromise = super.read(id);

        return new Promise(function (resolve, reject) {
            superPromise.then(function (jsonAPIInstance) {
                resolve(new GraphQLifiedJsonAPIInstance(jsonAPIInstance.data, jsonAPIInstance.client).graphQLObject())
            }).catch(rejectWithGraphQL(reject));
        })
    }

}

class GraphQLifiedJsonAPIInstance extends JSONAPIonifyInstance {
    constructor(data, client) {
        super(data, client);
    }

    graphQLObject() {
        return _.extend({ __api__: this, id: this.id() }, this.attributes())
    }

    related(name) {
        var superPromise = super.related(name);
        return new Promise(function (resolve, reject) {
            superPromise.then(function (objOrAry) {
                if (objOrAry instanceof Array) {
                    resolve(new GraphQLifiedJsonAPICollection(objOrAry.responseJson, objOrAry.client));
                } else if (objOrAry instanceof Object) {
                    resolve(new GraphQLifiedJsonAPIInstance(objOrAry.data, objOrAry.client).graphQLObject());
                }
            }).catch(rejectWithGraphQL(reject));
        })
    }

    updateData() {
        var instance = this;
        var data = _.extend({}, this.data);

        return new Promise(function (resolve, reject) {
            instance.options().then(function (response) {
                data.attributes = _.pick(
                    data.attributes,
                    response.json.meta.requests.PATCH.attributes.map(function (attr) {
                        return attr.name
                    })
                );
                resolve(data)
            }).catch(rejectWithGraphQL(reject));
        });
    }

    save() {
        var instance = this;
        return new Promise(function (resolve, reject) {
            instance.updateData().then(function (data) {
                var request = instance.client.patch(instance.data.links[ 'self' ], { data: data });
                processResponse(request, function (response) {
                    instance.data = response.json.data;
                    resolve(instance.graphQLObject());
                });
            }).catch(reject);
        });
    }

    delete() {
        var superPromise = super.delete();
        return new Promise(function (resolve, reject) {
            superPromise.then(function (response) {
                resolve(response)
            }).catch(rejectWithGraphQL(reject))
        })
    }
}

class GraphQLifiedJsonAPICollection extends JSONAPIonifyCollection {
    constructor(responseJson, client) {
        super(responseJson, client);

        while (this.length) {
            this.pop()
        }

        var collection = this;
        responseJson.data.forEach(function (data) {
            collection.push(new GraphQLifiedJsonAPIInstance(data, client).graphQLObject());
        });
    }

    create(type, data) {
        var superPromise = super.create(type, data);
        return new Promise(function (resolve, reject) {
            superPromise.then(function (jsonApiInstance) {
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


module.exports = { GraphQLifiedJsonAPI: GraphQLifiedJsonAPI };
