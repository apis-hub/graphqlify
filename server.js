import express from "express";
import graphqlHTTP from "express-graphql";
import schema from "./graph/schema";
import path from "path";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import { graphql } from "graphql";
import { GraphQLifiedJsonAPI } from "./adapters/api_adapter";
import cors from "cors";

const webPackConfig = {
    entry: path.resolve(__dirname, 'lib', 'console.jsx'),
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
    output: { filename: 'console.js', path: '/assets' }
};

const compiler = webpack(webPackConfig);
const app = express();

// Enable Cors
app.use('/graphql', cors());

// Serve Webpack
app.use('/assets', webpackMiddleware(compiler));

// Serve Static
app.use('/', express.static(path.join(__dirname, 'public')));

const graphQLMiddleware = graphqlHTTP((request) => {
    var headers = {};
    var endpoint = process.env.BRANDFOLDER_API_ENDPOINT;

    if (request.headers.authorization) {
        headers.authorization = request.headers.authorization
    }

    var client = new GraphQLifiedJsonAPI(endpoint, { headers: headers });

    return {
        schema: schema,
        rootValue: { client: client }
    }
});

// Serve GraphQL
app.use('/graphql', graphQLMiddleware);

// load console at root
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'views/console.html'))
});

var port = process.env.PORT || 8080;
app.listen(port);
console.log(`Started on http://localhost:${port}/`);
