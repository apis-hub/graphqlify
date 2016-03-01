import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';
import { userPermissionType } from '../types/user_permission_type';
import { organizationType } from '../types/organization_type';
import { brandfolderType } from '../types/brandfolder_type';
import { collectionType } from '../types/collection_type';

const createOrganizationUserPermission = mutationWithClientMutationId({
  name: 'createOrganizationUserPermission',
  inputFields: {
    permission_level: {
      type: new GraphQLNonNull(GraphQLString)
    },
    organization_id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    userPermission: {
      type: userPermissionType,
      resolve: ({ userPermission }) => userPermission
    },
    organization: {
      type: organizationType,
      resolve: ({ organizationId, rootContext }) => {
        return new Promise(function (resolve, reject) {
          rootContext.rootValue.client.resource('organizations').read(organizationId).then(function (organization) {
            resolve(organization);
          }).catch(reject);
        });
      }
    }
  },
  mutateAndGetPayload: ({ permission_level, organization_id } , context) => {
    const organizationId = fromGlobalId(organization_id).id;
    const rootContext = context;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('organizations').read(organizationId).then(function (organization) {
        organization.__api__.related('userPermissions').then(function (userPermissions) {
          userPermissions.create('userPermissions', {
            permission_level: permission_level
          }).then(function (userPermission) {
            resolve({
              userPermission,
              organizationId,
              rootContext
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  }
});


const createBrandfolderUserPermission = mutationWithClientMutationId({
  name: 'createBrandfolderUserPermission',
  inputFields: {
    permission_level: {
      type: new GraphQLNonNull(GraphQLString)
    },
    brandfolder_id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    userPermission: {
      type: userPermissionType,
      resolve: ({ userPermission }) => userPermission
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
  mutateAndGetPayload: ({ permission_level, brandfolder_id } , context) => {
    const brandfolderId = fromGlobalId(brandfolder_id).id;
    const rootContext = context;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('brandfolders').read(brandfolderId).then(function (brandfolder) {
        brandfolder.__api__.related('userPermissions').then(function (userPermissions) {
          userPermissions.create('userPermissions', {
            permission_level: permission_level
          }).then(function (userPermission) {
            resolve({
              userPermission,
              brandfolderId,
              rootContext
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  }
});


const createCollectionUserPermission = mutationWithClientMutationId({
  name: 'createCollectionUserPermission',
  inputFields: {
    permission_level: {
      type: new GraphQLNonNull(GraphQLString)
    },
    collection_id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    userPermission: {
      type: userPermissionType,
      resolve: ({ userPermission }) => userPermission
    },
    collection: {
      type: collectionType,
      resolve: ({ collectionId, rootContext }) => {
        return new Promise(function (resolve, reject) {
          rootContext.rootValue.client.resource('collections').read(collectionId).then(function (collection) {
            resolve(collection);
          }).catch(reject);
        });
      }
    }
  },
  mutateAndGetPayload: ({ permission_level, collection_id } , context) => {
    const collectionId = fromGlobalId(collection_id).id;
    const rootContext = context;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('collections').read(collectionId).then(function (collection) {
        collection.__api__.related('userPermissions').then(function (userPermissions) {
          userPermissions.create('userPermissions', {
            permission_level: permission_level
          }).then(function (userPermission) {
            resolve({
              userPermission,
              collectionId,
              rootContext
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  }
});
export { createBrandfolderUserPermission, createCollectionUserPermission, createOrganizationUserPermission };
