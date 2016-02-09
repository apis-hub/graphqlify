"use strict";
const JSONAPIonify = require("JSONAPIonify-client")
const Resource = require("classes/resource")

module.exports = class extends JSONAPIonify {
  constructor(baseUrl, ClientOptions) {
    super(baseUrl, ClientOptions);
  }

  resource(name) {
    return new Resource(name, this);
  }
}
