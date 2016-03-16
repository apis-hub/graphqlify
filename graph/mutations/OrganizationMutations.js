import RootResourceMutator from '../helpers/RootResourceMutator';
import * as types from '../types/standard';
import requireMutations from '../helpers/requireMutations';

const { updateOrganization } = new RootResourceMutator(() => ({
  name: 'Organization',
  type: () => require('../types/Organization'),
  attributes: () => ({
    slug: new types.GraphQLNonNull(types.GraphQLString),
    name: new types.GraphQLNonNull(types.GraphQLString)
  })
}));

module.exports = {
  updateOrganization,
  ...requireMutations('Organization/BrandfoldersMutations')
};
