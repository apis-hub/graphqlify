import buildRelatedResourceMutations from '../helpers/buildRelatedResourceMutations';
import * as types from '../types/standard';

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
