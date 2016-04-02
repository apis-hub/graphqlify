import graphqlHTTP from 'express-graphql';
import stackTrace from 'stack-trace';
import Honeybadger from 'honeybadger';
import { JSONAPIonify, jsonApionifyLogger } from 'jsonapionify-client';

import schema from '../graph/schema';

function logError(error) {
  console.error('');

  error = error.error !== undefined ? error.error : error;
  let stack = stackTrace.parse(error.originalError);
  console.error(error.originalError.toString());
  stack.forEach(function (trace, index) {
    let file = trace.getFileName();
    let ln = trace.getLineNumber();
    let fn = trace.getFunctionName();
    console.error(`${index}: ${file}:${ln}:in ${fn}`);
  });

  console.error('');

  let { locations, message } = error;

  if (error.originalError.errors instanceof Array) {
    message = JSON.stringify(error.originalError.errors);
  }

  return {
    message,
    locations
  };
}

const graphQLMiddleware = graphqlHTTP(request => {
  const { hostname } = request;
  const hb = new Honeybadger({
    apiKey: process.env.HONEYBADGER_API_KEY,
    server: { hostname }
  });
  try {
    let timestamp = Math.floor(Date.now() / 1000);
    let headers = {};
    let endpoint = process.env.BRANDFOLDER_API_ENDPOINT;

    headers.forwarded = `for=${request.ip}`;
    headers['x-forwarded-for'] = request.ip;
    headers.Accept = 'application/vnd.api+json;brandfolder-api=private';

    if (request.headers.authorization) {
      headers.authorization = request.headers.authorization;
    }

    let api = new JSONAPIonify(endpoint, {
      allowSetHeaders: true,
      headers
    });

    api.addMiddleware(jsonApionifyLogger);

    return {
      formatError: logError,
      schema,
      rootValue: {
        api,
        timestamp
      }
    };
  } catch (error) {
    hb.send(error);
    throw error;
  }
});

export default graphQLMiddleware;
