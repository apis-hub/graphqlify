import { HTTPError401, HTTPError412, HTTPError419 } from "JSONAPIonify-client/errors"

function catchUnauthorized(rootValue) {
  return function(error) {
    if (error instanceof HTTPError401 || error instanceof HTTPError419 || error instanceof HTTPError412) {
      rootValue.statusCode = error.statusCode;
    }
    throw error
  }
}

function catchExpired(rootValue) {
  return function(error) {
    if (error instanceof HTTPError419 || error instanceof HTTPError412) {
      rootValue.statusCode = error.statusCode;
    }
    throw error
  }
}

export { catchUnauthorized, catchExpired }
