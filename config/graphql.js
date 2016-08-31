import _ from 'lodash';
import graphqlHTTP from 'express-graphql';
import stackTrace from 'stack-trace';
import JSONAPIonify from 'jsonapionify-client';

import schema from '../graph/schema';
import Honeybadger from './honeybadger';

function logError(error) {
  console.error('');

  let { locations, message } = error;
  if (error.originalError) {
    // Display trace server side
    let trace = stackTrace.parse(error.originalError);
    console.error(error.originalError.toString());
    trace.forEach(function (t, index) {
      let file = t.getFileName();
      let ln = t.getLineNumber();
      let fn = t.getFunctionName();
      console.error(`${index}: ${file}:${ln}:in ${fn}`);
    });

    // Return JSONAPI errors
    if (error.originalError.errors instanceof Array) {
      message = JSON.stringify(error.originalError.errors);
    }
  }

  console.error('');
  Honeybadger.notify(error);

  return {
    message,
    locations
  };
}

const graphQLMiddleware = graphqlHTTP(request => {
  let headers = {};
  let endpoint = process.env.BRANDFOLDER_API_ENDPOINT;

  headers.forwarded = `for=${request.ip}`;
  headers['x-forwarded-for'] = request.ip;
  Object.assign(headers, _.pick(request.headers, 'user-agent', 'referer'));
  headers.Accept = 'application/vnd.api+json;brandfolder-api=private';

  if (request.headers.authorization) {
    headers.authorization = request.headers.authorization;
  }

  let api = new JSONAPIonify(endpoint, {
    allowSetHeaders: true,
    headers
  });

  api.addMiddleware(JSONAPIonify.Logger);

  return {
    formatError: logError,
    pretty: process.env.NODE_ENV !== 'production',
    schema,
    context: {
      api
    }
  };
});

export default graphQLMiddleware;
