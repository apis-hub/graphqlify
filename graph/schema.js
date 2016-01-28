import { GraphQLSchema } from "graphql/type";
import queryType from "./types";
import mutationType from "./mutations";


let schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
});

export default schema;
