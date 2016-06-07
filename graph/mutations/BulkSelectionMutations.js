import * as types from '../types/standard';
import RootResourceMutator from '../builders/RootResourceMutator';

const { updateBulkSelection } = new RootResourceMutator(() => ({
  name: 'BulkSelection',
  type: () => require('../types/BulkSelection'),
  updateAttributes: () => ({
    select: types.GraphQLReusableObject,
    tag: types.GraphQLReusableObject,
    merge: types.GraphQLReusableObject,
    approve: types.GraphQLReusableObject,
    delete: types.GraphQLReusableObject
  })
}));

export { updateBulkSelection };
