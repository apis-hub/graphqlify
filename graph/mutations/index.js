import { GraphQLObjectType } from 'graphql/type';
import { updateOrganization } from './OrganizationMutations';
import { createOrganizationBrandfolder } from './OrganizationBrandfolderMutations';
import { updateBrandfolder, deleteBrandfolder } from './BrandfolderMutations';
import { createUser, updateUser, deleteUser } from './UserMutations';

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: ({
    createUser,
    updateUser,
    deleteUser,
    updateOrganization,
    createOrganizationBrandfolder,
    updateBrandfolder,
    deleteBrandfolder
  })
});

export default mutationType;
