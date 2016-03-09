import { buildRelatedResourceMutations } from '../mutationHelpers';
import * as types from '../GraphQLTypes';

const { createOrganizationBrandfolder } =
  buildRelatedResourceMutations(() => ({
    type: require('../types/Brandfolder'),
    parentType: require('../types/Organization'),
    relationship: 'brandfolders',
    inputFields: {
      name: new types.GraphQLNonNull(types.GraphQLString)
    }
  }));

export { createOrganizationBrandfolder };
