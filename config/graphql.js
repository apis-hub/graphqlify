import schema from '../graph/schema';
import graphqlHTTP from 'brandfolder-express-graphql';
import { JSONAPIonify, jsonApionifyLogger } from 'jsonapionify-client';
import stackTrace from 'stack-trace';

function logError(error) {
  console.error('');

  error = error.error !== undefined ? error.error : error;
  let stack = stackTrace.parse(error);
  console.error(error.toString());
  stack.forEach(function (trace, index) {
    console.error(`${index}: ${trace.getFileName()}:${trace.getLineNumber()}:in ${trace.getFunctionName()}`);
  });

  console.error('');
  return error;
}

const graphQLMiddleware = graphqlHTTP(request => {
  let headers = {};
  let endpoint = process.env.BRANDFOLDER_API_ENDPOINT;

  if (request.headers.authorization) {
    headers.authorization = request.headers.authorization;
  }

  let api = new JSONAPIonify(endpoint, {
    headers
  });

  api.addMiddleware(jsonApionifyLogger);

  return {
    formatError: logError,
    schema,
    rootValue: {
      api
    }
  };
});

export default graphQLMiddleware;
