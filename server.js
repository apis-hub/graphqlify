import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './graph/schema';

import {graphql}      from 'graphql';
import bodyParser     from 'body-parser';
import APIAdapter     from './adapters/api_adapter';

let app  = express();
app.use(express.static(__dirname));
app.use('/graphql', graphqlHTTP(() => ({
        schema: schema
    })));
app.listen(8080);
console.log('Started on http://localhost:8080/');