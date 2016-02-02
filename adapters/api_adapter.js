"use strict";
var _ = require('lodash');
var JSONAPIonify = require('JSONAPIonify-client');
var JSONAPIonifyCollection = require('JSONAPIonify-client/classes/collection');
var JSONAPIonifyInstance = require('JSONAPIonify-client/classes/instance');
var JSONAPIonifyResource = require('JSONAPIonify-client/classes/resource');
var processResponse = require('JSONAPIonify-client/helpers/process_response');

class GraphQLifiedJsonAPIResource extends JSONAPIonifyResource {
  constructor(name, client) {
    super(name, client);
  }

  index() {
    return super.index().then(function(jsonAPICollection) {
      return new GraphQLifiedJsonAPICollection(jsonAPICollection.responseJson, jsonAPICollection.client);
    });
  }

  create(data) {
    return super.create(data).then(function(jsonAPIInstance) {
      return new GraphQLifiedJsonAPIInstance(jsonAPIInstance.data, jsonAPIInstance.client).graphQLObject();
    });
  }

  read(id) {
    return super.read(id).then(function(jsonAPIInstance) {
      return new GraphQLifiedJsonAPIInstance(jsonAPIInstance.data, jsonAPIInstance.client).graphQLObject();
    });
  }

}

class GraphQLifiedJsonAPIInstance extends JSONAPIonifyInstance {
  constructor(data, client) {
    super(data, client);
  }

  graphQLObject() {
    return _.extend({
      __api__: this,
      id: this.id()
    }, this.attributes())
  }

  related(name) {
    return super.related(name).then(function(objOrAry) {
      if (objOrAry instanceof Array) {
        return new GraphQLifiedJsonAPICollection(objOrAry.responseJson, objOrAry.client);
      } else if (objOrAry instanceof Object) {
        return new GraphQLifiedJsonAPIInstance(objOrAry.data, objOrAry.client).graphQLObject();
      }
    })
  }

  prepareUpdateData() {
    var instance = this;
    return this.options().then(function(response) {
      var data = _.extend({}, instance.data);
      data.attributes = _.pick(
        data.attributes,
        response.json.meta.requests.PATCH.attributes.map(function(attr) {
          return attr.name
        })
      );
      return data
    });
  }

  save() {
    var instance = this;
    return instance.prepareUpdateData().then(function(data) {
      return instance.client.patch(instance.data.links['self'], {
        data: data
      });
    }).then(processResponse).then(function(response) {
      instance.data = response.json.data;
      return instance.graphQLObject();
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
    responseJson.data.forEach(function(data) {
      collection.push(new GraphQLifiedJsonAPIInstance(data, client).graphQLObject());
    });
  }

  create(type, data) {
    super.create(type, data).then(function(jsonApiInstance) {
      return new GraphQLifiedJsonAPIInstance(jsonApiInstance.data, jsonApiInstance.client).graphQLObject();
    });
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


module.exports = {
  GraphQLifiedJsonAPI: GraphQLifiedJsonAPI
};
