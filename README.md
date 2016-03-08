Brandfolder - GraphQLify
===============
GraphQLify is the middleman between Brandfolder's frontend and Brandfolder's backend. It translates Brandfolder's JSON API into GraphQL for comsumption by the Brandfolder frontend written in React/Relay.

This repo is internal to Brandfolder and is publicized to provide the public with a GraphQL - JSONApi translation implementation.
It provides examples for how others may implement a GraphQL translation layer of their own.

Playground
---------------
You can play with the Brandfolder GraphQL API at https://graphql.brandfolder.com

Pre-requisites
---------------
- Have Node and NPM installed

Installation
--------------
Clone the repo and install its dependencies:
```sh
$ git clone git@github.com:brandfolder/graphqlify.git
$ cd graphqlify/
$ npm install
```

Create a .env file:
```sh
$ touch .env
```

Add the following key/values to said .env:
```
BRANDFOLDER_API_ENDPOINT=http://api.lvh.me:3000/v2
```

Alternatively, you can point the BRANDFOLDER_API_ENDPOINT to http://api.brandfolder.com/v2 or a staging environment if you don't want to run against a local server. 

Run the Server
---------------
Just type:
```sh
$ babel-node index.js
```

Status
---------------
***This repo is still under heavy development.***
