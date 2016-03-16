import RelatedResourceMutator from '../../helpers/RelatedResourceMutator';
import * as types from '../../types/standard';

const { createBrandfoldersCollection } = new RelatedResourceMutator(() => ({
  type: () => require('../../types/Collection'),
  parentType: () => require('../../types/Brandfolder'),
  relationship: 'collections',
  attributes: () => ({
    slug: types.GraphQLString,
    name: types.GraphQLString,
    private: types.GraphQLBoolean,
    public: types.GraphQLBoolean,
    stealth: types.GraphQLBoolean,
    card_image: types.GraphQLString,
    header_image: types.GraphQLString
  })
}));

export { createBrandfoldersCollection };
