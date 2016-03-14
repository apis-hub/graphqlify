import { slugInterface } from '../interfaces/slug';
import ApiResourceType from '../helpers/ApiResourceType';
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
    organization: require('./Organization'),
    brandfolder: require('./Brandfolder')
  },
  relatesToMany: {
    sections: require('./Section'),
    assets: require('./Asset'),
    collections: require('./Collection'),
    // ...require('./concerns/permissibleRelationships')
  },
}), slugInterface);

module.exports = collectionType;
