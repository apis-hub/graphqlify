import express          from 'express';
import graphqlHTTP      from 'express-graphql';
import schema           from './graph/schema';
import webpack          from 'webpack';
import path             from 'path';
import webpackMiddleware from 'webpack-dev-middleware';
import fs               from 'fs';
import {graphql}        from 'graphql';
import bodyParser       from 'body-parser';
import APIAdapter       from './adapters/api_adapter';
const APP_PORT = 3001;

const webPackConfig  = {
    entry:   path.resolve(__dirname, 'app', 'app.jsx'),
    resolve: {
        extensions: ['', '.js', '.jsx', '.es6']
    },
    module:  {
        loaders: [
            {
                exclude: /node_modules/,
                loader:  'babel-loader',
                test:    /\.(js|jsx|es6)$/
            },
            {
                loaders: ['style', 'css', 'sass'],
                test: /\.scss$/
            }
        ]
    },
    output:  { filename: 'app.js', path: '/assets' }
};
const compiler       = webpack(webPackConfig);
const brandfolderApp = express();

// Serve Webpack
brandfolderApp.use(webpackMiddleware(compiler));

// Serve GraphQL
brandfolderApp.use('/graphql', graphqlHTTP(() => ({
    schema: schema
})));

// Serve static resources
brandfolderApp.use('/', express.static(path.resolve(__dirname, 'public')));

// Graphql console
brandfolderApp.get('/console', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'views/console.html'))
});


// Main app
brandfolderApp.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'views/index.html'))
});

// Listen
brandfolderApp.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}`);
});
