import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';
import { collectionType } from '../types/collection_type';
import { brandfolderType } from '../types/brandfolder_type';
import { reusableDataType } from '../types/reusable_data_type';

const createCollection = mutationWithClientMutationId({
  name: 'createCollection',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString)
    },
    brandfolder_id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    collection: {
      type: collectionType,
      resolve: ({ collection }) => collection
    },
    brandfolder: {
      type: brandfolderType,
      resolve: ({ brandfolderId, rootContext }) => {
        return new Promise(function (resolve, reject) {
          rootContext.rootValue.client.resource('brandfolders').read(brandfolderId).then(function (brandfolder) {
            resolve(brandfolder);
          }).catch(reject);
        });
      }

    }
  },
  mutateAndGetPayload: ({ name, brandfolder_id, slug } , context) => {
    const brandfolderId = fromGlobalId(brandfolder_id).id;
    const rootContext = context;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('brandfolders').read(brandfolderId).then(function (brandfolder) {
        brandfolder.__api__.related('collections').then(function (collections) {
          collections.create('collections', {
            name: name,
            slug: slug
          }).then(function (collection) {
            resolve({
              collection,
              brandfolderId,
              rootContext
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  },
});

const updateCollection = mutationWithClientMutationId({
  name: 'updateCollection',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    slug: {
      type: GraphQLString
    },
    is_public: {
      type: GraphQLBoolean
    },
    stealth: {
      type: GraphQLBoolean
    },
    options: {
      type: reusableDataType
    }
  },
  outputFields: {
    collection: {
      type: collectionType,
      resolve: ({ collection }) => collection
    }
  },
  mutateAndGetPayload: ({ id, name, is_public, slug, stealth, options } , context) => {
    const collectionId = fromGlobalId(id).id;
    var collectionName = name,
      collectionIsPublic = is_public,
      collectionSlug = slug,
      collectionStealth = stealth,
      collectionOptions = options;

    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('collections').read(collectionId).then(function (collection) {
        if (collectionName) {
          collection.name = collectionName;
        }
        if (collectionIsPublic) {
          collection.is_public = collectionIsPublic;
        }
        if (collectionSlug) {
          collection.slug = collectionSlug;
        }
        if (collectionStealth) {
          collection.stealth = collectionStealth;
        }
        if (collectionOptions) {
          collection.options = collectionOptions;
        }

        collection.__api__.update(collection).then(function (collection) {
          resolve({
            collection
          });
        }).catch(reject);
      }).catch(reject);
    });
  },
});

const deleteCollection = mutationWithClientMutationId({
  name: 'deleteCollection',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    deletedId: {
      type: GraphQLID,
      resolve: ({ collectionId }) => collecitonId
    }
  },
  mutateAndGetPayload: ({ id }, context) => {
    var collectionId = fromGlobalId(id).id;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('collections').read(collectionId).then(function (collection) {
        collection.__api__.delete().then(function () {
          resolve({
            collectionId
          });
        });
      }).catch(reject);
    });
  }
});

export { createCollection, updateCollection, deleteCollection };
