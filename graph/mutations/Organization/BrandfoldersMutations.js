import RelatedResourceMutator from '../../helpers/RelatedResourceMutator';
import * as types from '../../types/standard';

const { createOrganizationsBrandfolder } = new RelatedResourceMutator(() => ({
  type: () => require('../../types/Brandfolder'),
  parentType: () => require('../../types/Organization'),
  relationship: 'brandfolders',
  attributes: () => ({
    name: new types.GraphQLNonNull(types.GraphQLString)
  })
}));

export { createOrganizationsBrandfolder };
