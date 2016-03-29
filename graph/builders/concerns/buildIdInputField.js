import * as types from '../../types/standard';

export default function buildIdInputField() {
  return {
    id: {
      type: new types.GraphQLNonNull(types.GraphQLID)
    }
  };
}
