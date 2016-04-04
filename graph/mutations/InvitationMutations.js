import RootResourceMutator from '../builders/RootResourceMutator';
import * as types from '../types/standard';

const { updateInvitation, deleteInvitation } = new RootResourceMutator(() => ({
  name: 'Invitation',
  type: () => require('../types/Invitation'),
  updateAttributes: () => ({
    active: new types.GraphQLNonNull(types.GraphQLBoolean)
  })
}));

export { updateInvitation, deleteInvitation };
