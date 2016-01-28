import { GraphQLScalarType } from "graphql";

var reusableDataType = new GraphQLScalarType({
    name: 'reusable_data_type',
    serialize: value => value,
    parseValue: value => value,
    parseLiteral: ast => value
});

export { reusableDataType };
