import { type as userType } from "./User";
import { connectionType as organizationConnectionType } from "./Organization";
import { connectionArgs, connectionFromPromisedArray } from "graphql-relay";
import { catchExpired } from "../../lib/catchUnauthorized";
import * as types from "../GraphQLTypes";

function fetchCurrentUser(context) {
  return context.rootValue.api.resource('users').read('_self').catch(catchExpired(context.rootValue))
}

function fetchCurrentOrganizations(context) {
  return fetchCurrentUser(context).then((user) => user.related('organizations'))
}

var type = new types.GraphQLObjectType({
  name: 'Viewer',
  description: 'The query root of the schema',
  fields: () => ({
    authenticated: {
      type: types.GraphQLBoolean,
      resolve: (root, args, context) => {
        return fetchCurrentUser(context).catch((err) => err).then(
          (result) => result instanceof Error ? false : true
        )
      }
    },
    user: {
      type: userType,
      resolve: (root, args, context) => fetchCurrentUser(context).catch(() => context.rootValue.api.resource('users').new({}))
    },
    organizations: {
      type: organizationConnectionType,
      args: connectionArgs,
      resolve: (root, args, context) => {
        return fetchCurrentOrganizations(context).catch(() => [])
      }
    }
  })
});

export { type };
