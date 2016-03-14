import RootResourceMutator from '../helpers/RootResourceMutator';
import * as types from '../types/standard';

const { deleteAttachment } = new RootResourceMutator(() => ({
  type: () => require('../types/Attachment'),
  attributes: () => ({
    url: new types.GraphQLNonNull(types.GraphQLString)
  })
}));

module.exports = {
  deleteAttachment
};
