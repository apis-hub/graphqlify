import { GraphQLObjectType } from 'graphql/type';
import { nodeField }         from '../node_identification';
import { slugField }         from '../slug_identification';
import { rootType }          from './root_type';

var queryType = new GraphQLObjectType({
    name:        'Query',
    description: 'The query root of the schema',
    fields:      () => ({
        root: {
            type:    rootType,
            resolve: (context) => {
                return context.client
            }
        },
        node: nodeField,
        slug: slugField
    })
});

export default queryType;