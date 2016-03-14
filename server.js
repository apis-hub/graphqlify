import express from 'express';
import graphqlHTTP from 'brandfolder-express-graphql';
import schema from './graph/schema';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import { JSONAPIonify, jsonApionifyLogger } from 'jsonapionify-client';
import cors from 'cors';
import morgan from 'morgan';
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

const logger = morgan('tiny');

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
        test: /\.(js|jsx|es6)$/,
        query: {
          presets: [ 'es2015', 'stage-0', 'react' ]
        }
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

// Enable Logger
app.use(logger);

// Enable Cors
app.use('/graphql', cors());

// Serve Webpack
app.use('/assets', webpackMiddleware(compiler));

// Serve Static
app.use('/', express.static(path.join(__dirname, 'public')));

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

// Serve GraphQL
app.use('/graphql', graphQLMiddleware);

// load console at root
app.get('/', (req, res) => res.sendFile(
  path.resolve(__dirname, 'views/console.html')
));

const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Started on http://localhost:${port}/`);
