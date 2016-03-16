import { slugInterface } from '../interfaces/slug';
import ApiResourceType from '../builders/ApiResourceType';
import { permissibleInterface } from '../interfaces/permissible';
import requireType from '../helpers/requireType';
import * as types from './standard';

const collectionType = new ApiResourceType('Collection', () => ({
  attributes: {
    name: new types.GraphQLNonNull(types.GraphQLString),
    slug: new types.GraphQLNonNull(types.GraphQLString),
    public: new types.GraphQLNonNull(types.GraphQLBoolean),
    private: new types.GraphQLNonNull(types.GraphQLBoolean),
    stealth: new types.GraphQLNonNull(types.GraphQLBoolean),
    header_image: types.GraphQLString,
    feature_names: new types.GraphQLList(types.GraphQLString),
    number_of_assets: new types.GraphQLNonNull(types.GraphQLInt),
    number_of_sections: new types.GraphQLNonNull(types.GraphQLInt),
    ...require('./concerns/timestamps')
  },
  relatesToOne: {
    organization: requireType('Organization'),
    brandfolder: requireType('Brandfolder')
  },
  relatesToMany: {
    sections: requireType('Section'),
    assets: requireType('Asset'),
    collections: requireType('Collection'),
    ...require('./concerns/permissibleRelationships')()
  },
}), slugInterface, permissibleInterface);

module.exports = collectionType;
