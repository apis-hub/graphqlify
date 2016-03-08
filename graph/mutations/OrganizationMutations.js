import { buildRootResourceMutations } from '../mutationHelpers';
import * as types from '../GraphQLTypes';

const { updateOrganization } =
  buildRootResourceMutations(() => ({
    resource: 'organizations',
    type: require('../types/Organization'),
    inputFields: {
      slug: new types.GraphQLNonNull(types.GraphQLString),
      name: new types.GraphQLNonNull(types.GraphQLString)
    }
  }));

export { updateOrganization };
