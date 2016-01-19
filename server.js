import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './graph/schema';
import path from 'path';
import webpack          from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import url from 'url';
import {graphql}      from 'graphql';
import bodyParser     from 'body-parser';
import { APIAdapter, signRequest }     from './adapters/api_adapter';

const webPackConfig = {
    entry:   path.resolve(__dirname, 'lib', 'console.jsx'),
    resolve: {
        extensions: ['', '.js', '.jsx', '.es6']
    },
    module:  {
        loaders: [
            {
                exclude: /node_modules/,
                loader:  'babel-loader',
                test:    /\.(js|jsx|es6)$/
            }
        ]
    },
    output:  { filename: 'console.js', path: '/assets' }
};

const compiler = webpack(webPackConfig);
const app      = express();

// Serve Webpack
app.use('/assets', webpackMiddleware(compiler));

// Serve Static
app.use('/', express.static(path.join(__dirname, 'public')));

// Serve GraphQL
app.use('/graphql', graphqlHTTP((request) => {
    var headers  = {};
    var endpoint = process.env.BRANDFOLDER_API_ENDPOINT || 'http://example.org';

    if (request.headers.authorization) {
        headers.authorization = request.headers.authorization
    }

    var client = new APIAdapter(endpoint, { headers: headers });

    // Sign the requests if they are external.
    client.jsonapi.beforeRequest(signRequest);

    return {
        schema:    schema,
        rootValue: { client: client }
    }
}));
var port = process.env.PORT || 8080;
app.listen(port);
console.log(`Started on http://localhost:${port}/`);