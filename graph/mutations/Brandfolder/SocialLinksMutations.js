import * as types from '../../types/standard';

import RelatedResourceMutator from '../../builders/RelatedResourceMutator';

const { createBrandfoldersSocialLink, deleteBrandfoldersSocialLink } =
  new RelatedResourceMutator(() => ({
    type: () => require('../../types/SocialLink'),
    parentType: () => require('../../types/Brandfolder'),
    relationship: 'social_links',
    createAttributes: () => ({
      name: new types.GraphQLNonNull(types.GraphQLString),
      url: new types.GraphQLNonNull(types.GraphQLString),
      position: types.GraphQLInt
    })
  }));

export { createBrandfoldersSocialLink, deleteBrandfoldersSocialLink };
