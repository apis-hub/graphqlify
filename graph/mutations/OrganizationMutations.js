import buildRootResourceMutations from '../helpers/buildRootResourceMutations';
import * as types from '../types/standard';

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
