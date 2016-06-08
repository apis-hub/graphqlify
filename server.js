import cors from 'cors';
import express from 'express';
import path from 'path';
import { printSchema } from 'graphql/utilities';

import graphql from './config/graphql';
import logger from './config/logger';
import schema from './graph/schema.js';
import webpack from './config/webpack';
import Honeybadger from './config/honeybadger';

const app = express();

// Enable Logger
app.use('/graphql', logger);

// Enable Honeybadger
app.use(Honeybadger.requestHandler);
app.use(Honeybadger.metricsHandler);

// Enable Cors
app.use('/graphql', cors({
  origin: true,
  methods: [ 'POST' ],
  allowedHeaders: 'Authorization,Content-Type,Accept'
}));

// Serve Webpack
app.use('/assets', webpack);

// Catch Errors
app.use(Honeybadger.errorHandler);

// Serve GraphQL
app.use('/graphql', graphql);

// load human readable graphql
app.get('/schema.graphql', (req, res) => {
  res.write(printSchema(schema));
});

// load console at root
app.get('/', (req, res) => res.sendFile(
  path.resolve(__dirname, 'views/index.html')
));

// Start the server
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Started on http://localhost:${port}/`);
