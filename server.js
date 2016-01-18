import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './graph/schema';
import path from 'path';

import {graphql}      from 'graphql';
import bodyParser     from 'body-parser';
import APIAdapter     from './adapters/api_adapter';

let app  = express();
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/graphql', graphqlHTTP(() => ({
        schema: schema
    })));
var port = process.env.PORT || 8080;
app.listen(port);
console.log(`Started on http://localhost:${port}/`);