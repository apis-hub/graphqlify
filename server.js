import cors from 'cors';
import express from 'express';
import path from 'path';

import graphql from './config/graphql';
import logger from './config/logger';
import webpack from './config/webpack';

const app = express();

// Enable Logger
app.use(logger);

// Enable Cors
app.use('/graphql', cors());

// Serve Webpack
app.use('/assets', webpack);

// Serve GraphQL
app.use('/graphql', graphql);

// load console at root
app.get('/', (req, res) => res.sendFile(
  path.resolve(__dirname, 'views/index.html')
));

// Start the server
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Started on http://localhost:${port}/`);
