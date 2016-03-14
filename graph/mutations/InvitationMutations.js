import RootResourceMutator from '../helpers/RootResourceMutator';
import * as types from '../types/standard';

const { updateInvitation, deleteInvitation } = new RootResourceMutator(() => ({
  name: 'Invitation',
  type: () => require('../types/Invitation'),
  attributes: () => ({
    permission_level: new types.GraphQLNonNull(types.GraphQLString)
  })
}));

export { updateInvitation, deleteInvitation };
