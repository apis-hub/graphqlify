import { type as userType } from './User';
import { connectionType as organizationConnectionType } from './Organization';
import { connectionArgs } from 'graphql-relay';
import { catchExpired } from '../helpers/catchErrors';
import * as types from './standard';
import { collectionToConnection, connectionFromRelatesToMany } from '../helpers/connectionHelpers';
import fetchTypeById from '../helpers/fetchTypeById';

function fetchCurrentUser(context) {
  return fetchTypeById(
    'users', '_self', context, {}, 'user'
  ).catch(
    catchExpired(context.rootValue)
  );
}

let type = new types.GraphQLObjectType({
  name: 'Viewer',
  description: 'The query root of the schema',
  fields: () => ({
    authenticated: {
      type: types.GraphQLBoolean,
      resolve: (root, args, context) => {
        return fetchCurrentUser(context).catch(err => err).then(
          result => !Boolean(result instanceof Error || result.error)
        );
      }
    },
    user: {
      type: userType,
      resolve: (root, args, context) => fetchCurrentUser(context).catch(
        () => ({ instance: context.rootValue.api.resource('users').new({}) })
      )
    },
    organizations: {
      type: organizationConnectionType,
      args: {
        ...connectionArgs,
        order: {
          type: types.GraphQLString
        }
      },
      resolve: (root, args, context) => {
        return fetchCurrentUser(context).then(
          ({ instance }) => connectionFromRelatesToMany(instance, 'organizations', args, context)
        ).catch(
          () => collectionToConnection({
            collection: context.rootValue.api.resource('organizations').emptyCollection()
          })
        );
      }
    }
  })
});

export { type };
