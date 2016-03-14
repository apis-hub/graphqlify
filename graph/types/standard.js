import * as GraphQLTypes from 'graphql/type';
import { GraphQLScalarType } from 'graphql';

const types = { ...GraphQLTypes };

types.GraphQLReusableObject = new GraphQLScalarType({
  name: 'ReusableObject',
  serialize: value => value,
  parseValue: value => value,
  parseLiteral: value => value
});


module.exports = types;
