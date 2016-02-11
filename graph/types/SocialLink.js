import { buildResourceType } from "../typeHelpers"
import * as types from "../GraphQLTypes";

const {type, connectionType, edgeType} = buildResourceType('SocialLink', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    url: new types.GraphQLNonNull(types.GraphQLString),
    position: new types.GraphQLNonNull(types.GraphQLInt),
    created_at: new types.GraphQLNonNull(types.GraphQLString),
    updated_at: new types.GraphQLNonNull(types.GraphQLString)
  },
  relatesToOne: {
    brandfolder: require('./Brandfolder').type
  }
}));

export { type, connectionType, edgeType };
