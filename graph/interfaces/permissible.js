import { GraphQLInterfaceType, GraphQLString, GraphQLID, GraphQLNonNull } from 'graphql';
import resolveType from '../helpers/resolveType';
import _ from 'lodash';

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
    user_permissions: {
      type: require('../types/UserPermission').connectionType
    },
    users: {
      type: require('../types/User').connectionType
    }
  }),
  resolveType
});

export { permissibleInterface };
