import _ from 'lodash';
import {
  GraphQLInterfaceType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLBoolean
} from 'graphql';

import resolveType from '../helpers/resolveType';

_.mixin(require('lodash-inflection'));

let permissibleInterface = new GraphQLInterfaceType({
  name: 'Permissible',
  description: 'For objects that have users and user permissions',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: GraphQLString
    },
    can_own: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    can_admin: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    can_collaborate: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    can_read: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    user_permissions: {
      args: require('../types/UserPermission').connectionArgs,
      type: require('../types/UserPermission').connectionType
    },
    users: {
      args: require('../types/User').connectionArgs,
      type: require('../types/User').connectionType
    },
    invitations: {
      args: require('../types/Invitation').connectionArgs,
      type: require('../types/Invitation').connectionType
    },
    access_requests: {
      args: require('../types/AccessRequest').connectionArgs,
      type: require('../types/AccessRequest').connectionType
    }
  }),
  resolveType
});

export { permissibleInterface };
