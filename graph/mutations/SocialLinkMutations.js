import * as types from '../types/standard';

import RootResourceMutator from '../builders/RootResourceMutator';

const { updateSocialLink } = new RootResourceMutator(() => ({
  name: 'SocialLink',
  type: () => require('../types/SocialLink'),
  attributes: () => ({
    name: types.GraphQLString,
    url: types.GraphQLString,
    position: types.GraphQLInt
  })
}));

export { updateSocialLink };
