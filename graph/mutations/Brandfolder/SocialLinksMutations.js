import RelatedResourceMutator from '../../builders/RelatedResourceMutator';
import * as types from '../../types/standard';

const { createBrandfoldersSocialLink, deleteBrandfoldersSocialLink } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/SocialLink'),
    parentType: () => require('../../types/Brandfolder'),
    relationship: 'social_links',
    attributes: () => ({
      name: new types.GraphQLNonNull(types.GraphQLString),
      url: new types.GraphQLNonNull(types.GraphQLString),
      position: types.GraphQLInt
    })
  }));

export { createBrandfoldersSocialLink, deleteBrandfoldersSocialLink };
