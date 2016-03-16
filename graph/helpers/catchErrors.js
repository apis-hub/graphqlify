import { HTTPError401, HTTPError412, HTTPError419 } from 'jsonapionify-client';

function catchUnauthorized(rootValue) {
  return function (error) {
    if (error.error) {
      error = error.error;
    }
    if (error instanceof HTTPError401) {
      rootValue.statusCode = error.statusCode;
    }
    catchExpired(rootValue)(error);
  };
}

function catchExpired(rootValue) {
  return function (error) {
    if (error instanceof HTTPError419 || error instanceof HTTPError412) {
      rootValue.statusCode = error.statusCode;
    }
    throw error;
  };
}

export { catchUnauthorized, catchExpired };
