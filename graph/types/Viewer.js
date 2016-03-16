import { catchExpired } from '../helpers/catchErrors';
import requireType from '../helpers/requireType';
import * as types from './standard';
import { collectionToConnection, connectionFromRelatesToMany } from '../helpers/connectionHelpers';
import fetchTypeById from '../helpers/fetchTypeById';

// Fetch a current user, catch expired tokens and return the error to the user.
function fetchCurrentUser(context) {
  return fetchTypeById(
    'users', '_self', context, {}, 'user'
  ).catch(
    catchExpired(context.rootValue)
  );
}

// Resolve the current user field
function resolveCurrentUser(root, args, context) {
  fetchCurrentUser(context).catch(
    () => ({ instance: context.rootValue.api.resource('users').new({}) })
  );
}

// Resolve the user's organizations field
function resolveUserOrganizations(root, args, context) {
  let { rootValue } = context;
  let { api } = rootValue;
  return fetchCurrentUser(context).then(({ instance }) => {
    return connectionFromRelatesToMany(
      instance, 'organizations', args, context
    );
  }).catch(() => collectionToConnection({
    collection: api.resource('organizations').emptyCollection()
  }));
}

// Resolve the authenticated field
function resolveAuthenticated(root, args, context) {
  return fetchCurrentUser(context).catch(err => err).then(
    result => !Boolean(result instanceof Error || result.error)
  );
}

// Build the Type
let type = new types.GraphQLObjectType({
  name: 'Viewer',
  description: 'The viewer or current user authenticated against the api',
  fields: () => ({
    authenticated: {
      type: types.GraphQLBoolean,
      resolve: resolveAuthenticated
    },
    user: {
      type: requireType('User').type,
      resolve: resolveCurrentUser
    },
    organizations: {
      type: requireType('Organization').connectionType,
      args: {
        ...requireType('Organization').connectionArgs
      },
      resolve: resolveUserOrganizations
    }
  })
});

export { type };
