'use strict';
import fs from 'fs';
import path from 'path';
import schema from '../graph/schema.js';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Save JSON of full schema introspection for Babel Relay Plugin to use
(async() => {
  var result = await (graphql(schema, introspectionQuery));
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ', JSON.stringify(result.errors, null, 2)
    );
  } else {
    fs.writeFile(
      path.join(__dirname, '../public/schema.json'),
      JSON.stringify(result, null, 2)
    );
  }
})();

// Save user readable type system shorthand of schema
fs.writeFile(
    path.join(__dirname, '../public/schema.graphql'),
    printSchema(schema)
);
