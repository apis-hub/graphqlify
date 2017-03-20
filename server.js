import cors from 'cors';
import compression from 'compression';
import express from 'express';
import path from 'path';
import { printSchema } from 'graphql/utilities';

import graphql from './config/graphql';
import logger from './config/logger';
import schema from './graph/schema.js';
import webpack from './config/webpack';

const app = express();

// Enable compression
app.use(compression());

// Enable Logger
app.use('/graphql', logger);


// Enable Cors
app.use('/graphql', cors({
  origin: true,
  methods: [ 'POST' ],
  allowedHeaders: 'Authorization,Content-Type,Accept'
}));

// Serve Webpack
app.use('/assets', webpack);


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
