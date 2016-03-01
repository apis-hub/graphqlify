import express from 'express';
import graphqlHTTP from 'brandfolder-express-graphql';
import schema from './graph/schema';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import { JSONAPIonify } from 'jsonapionify-client';
import cors from 'cors';
const stackTrace = require('stack-trace');

function logError(error) {
  console.error('');

  error = error.error !== undefined ? error.error : error;
  var stack = stackTrace.parse(error);
  console.error(error.toString());
  stack.forEach(function (trace, index) {
    console.error(`${index}: ${trace.getFileName()}:${trace.getLineNumber()}:in ${trace.getFunctionName()}`);
  });

  console.error('');
  return error;
}

const webPackConfig = {
  entry: path.resolve(__dirname, 'views', 'console.jsx'),
  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.(js|jsx|es6)$/
      }
    ]
  },
  output: {
    filename: 'console.js',
    path: '/assets'
  }
};

const compiler = webpack(webPackConfig);
const app = express();

// Enable Cors
app.use('/graphql', cors());

// Serve Webpack
app.use('/assets', webpackMiddleware(compiler));

// Serve Static
app.use('/', express.static(path.join(__dirname, 'public')));

const graphQLMiddleware = graphqlHTTP(request => {
  var headers = {};
  var endpoint = process.env.BRANDFOLDER_API_ENDPOINT;

  if (request.headers.authorization) {
    headers.authorization = request.headers.authorization;
  }

  var api = new JSONAPIonify(endpoint, {
    headers
  });

  return {
    formatError: logError,
    schema,
    rootValue: {
      api
    }
  };
});

// Serve GraphQL
app.use('/graphql', graphQLMiddleware);

// load console at root
app.get('/', (req, res) => res.sendFile(
  path.resolve(__dirname, 'views/console.html')
));

var port = process.env.PORT || 8080;
app.listen(port);
console.log(`Started on http://localhost:${port}/`);
