import * as types from '../../types/standard';

import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { createBrandfoldersCollection } = new RelatedResourceMutator(() => ({
  type: () => require('../../types/Collection'),
  parentType: () => require('../../types/Brandfolder'),
  relationship: 'collections',
  createAttributes: () => ({
    name: new types.GraphQLNonNull(types.GraphQLString),
    slug: types.GraphQLString,
    private: types.GraphQLBoolean,
    public: types.GraphQLBoolean,
    stealth: types.GraphQLBoolean,
    card_image: types.GraphQLString,
    header_image: types.GraphQLString
  })
}));

export { createBrandfoldersCollection };
