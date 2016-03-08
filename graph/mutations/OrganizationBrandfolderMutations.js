import { buildRelatedResourceMutations } from '../mutationHelpers';
import * as types from '../GraphQLTypes';

const { createOrganizationBrandfolder } =
  buildRelatedResourceMutations(() => ({
    type: require('../types/Brandfolder'),
    parentType: require('../types/Organization'),
    inputFields: {
      name: new types.GraphQLNonNull(types.GraphQLString)
    }
  }));

export { createOrganizationBrandfolder };
