import RootResourceMutator from '../helpers/RootResourceMutator';
import * as types from '../types/standard';

const { updateSocialLink } = new RootResourceMutator(() => ({
  name: 'SocialLink',
  type: () => require('../types/SocialLink'),
  attributes: () => ({
    name: new types.GraphQLNonNull(types.GraphQLString),
    url: new types.GraphQLNonNull(types.GraphQLString),
    position: types.GraphQLInt
  })
}));

export { updateSocialLink };
