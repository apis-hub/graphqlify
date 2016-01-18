import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLUserEdge } from '../types/user_type';
import api                 from '../../adapters/api_adapter';

const createUser = mutationWithClientMutationId({
    name: 'CreateUser',
    inputFields: {
        email:                  { type: new GraphQLNonNull(GraphQLString) },
        first_name:             { type: GraphQLString },
        last_name:              { type: GraphQLString },
        password:               { type: GraphQLString },
    },
    outputFields: {
        userEdge: {
            type: GraphQLUserEdge,
            resolve: ({userId}) => {
                const user = api.getType('user').find(userId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('user').all(), user),
                    node: user
                };
            }
        }
    },
    mutateAndGetPayload: ({email, first_name, last_name, password, remember_token, superuser, password_recovery_token}) => {
        api.getType('user')
               .create({email: email, first_name: first_name, last_name: last_name, password: password })
               .then(result => { return { userId: result.id }; });
    },
});

const updateUser = mutationWithClientMutationId({
    name: 'UpdateUser',
    inputFields: {
        id:                     { type: new GraphQLNonNull(GraphQLID) },
        email:                  { type: new GraphQLNonNull(GraphQLString) },
        first_name:             { type: GraphQLString },
        last_name:              { type: GraphQLString },
        password:               { type: GraphQLString }
    },
    outputFields: {
        userEdge: {
            type: GraphQLUserEdge,
            resolve: ({userId}) => {
                const user = adapter.getType('user').find(userId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('user').all(), user),
                    node: user
                };
            },
        },
    },
    mutateAndGetPayload: ({ id, email, first_name, last_name, password }) => {
        const userId = fromGlobalId(id);
        api.getType('user')
               .update(userId, {email: email, first_name: first_name, last_name: last_name, password: password })
               .then(result=> { return { userId: result.id}; });
    },
});

const deleteUser = mutationWithClientMutationId({
    name: 'DeleteUser',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        userEdge: {
            type: GraphQLUserEdge,
            resolve: () => null
        }
    },
    mutateAndGetPayload: ({id}) => {
        var userId = fromGlobalId(id).id;
        api.getType('user').remove(userId);
    }
});

export { createUser, updateUser, deleteUser };