import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';
import { userType } from '../types/user_type';

const createUser = mutationWithClientMutationId({
  name: 'createUser',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    first_name: {
      type: GraphQLString
    },
    last_name: {
      type: GraphQLString
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: ({ user }) => user
    }
  },
  mutateAndGetPayload: ({ email, first_name, last_name, password } , context) => {
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('users').create(
        {
          email: email,
          first_name: first_name,
          last_name: last_name,
          password: password
        }
      ).then(function (user) {
        resolve({
          user
        });

      }).catch(reject);
    });
  },
});

const updateUser = mutationWithClientMutationId({
  name: 'updateUser',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    email: {
      type: GraphQLString
    },
    first_name: {
      type: GraphQLString
    },
    last_name: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: ({ user }) => user
    }
  },
  mutateAndGetPayload: ({ id, email, first_name, last_name, password } , context) => {
    const userId = fromGlobalId(id).id;
    var userEmail = email,
      userFirstName = first_name,
      userLastName = last_name,
      userPassword = password;

    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('users').read(userId).then(function (user) {
        if (userEmail) {
          user.email = userEmail;
        }
        if (userFirstName) {
          user.first_name = userFirstName;
        }
        if (userLastName) {
          user.last_name = userLastName;
        }
        if (userPassword) {
          user.password = userPassword;
        }

        user.__api__.update(user).then(function (user) {
          resolve({
            user
          });
        }).catch(reject);
      }).catch(reject);
    });
  }
});

const deleteUser = mutationWithClientMutationId({
  name: 'deleteUser',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
  },
  outputFields: {
    deletedId: {
      type: GraphQLID,
      resolve: ({ userId }) => userId
    }
  },
  mutateAndGetPayload: ({ id }, context) => {
    var userId = fromGlobalId(id).id;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('users').read(userId).then(function (user) {
        user.__api__.delete().then(function () {
          resolve({
            userId
          });
        });
      }).catch(reject);
    });
  }
});

export { createUser, updateUser, deleteUser };
