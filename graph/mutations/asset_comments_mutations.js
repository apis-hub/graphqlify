import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';
import { assetCommentType } from '../types/AssetComment';
import { assetType } from '../types/Asset';

const createAssetComment = mutationWithClientMutationId({
  name: 'createAssetComment',
  inputFields: {
    body: {
      type: GraphQLString
    },
    asset_id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    assetComment: {
      type: assetCommentType,
      resolve: ({ assetComment }) => assetComment
    },
    asset: {
      type: assetType,
      resolve: ({ assetId, rootContext }) => {
        return new Promise(function (resolve, reject) {
          rootContext.rootValue.client.resource('assets').read(assetId).then(function (asset) {
            resolve(asset);
          }).catch(reject);
        });
      }
    }

  },
  mutateAndGetPayload: ({ body, asset_id } , context) => {
    const assetId = fromGlobalId(asset_id).id;
    const rootContext = context;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('assets').read(assetId).then(function (asset) {
        asset.__api__.related('assetComments').then(function (assetComments) {
          assetComments.create('assetComments', {
            body: body
          }).then(function (assetComment) {
            resolve({
              assetComment,
              assetId,
              rootContext
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  },
});

const deleteAssetComment = mutationWithClientMutationId({
  name: 'deleteAssetComment',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
  },
  outputFields: {
    deletedId: {
      type: GraphQLID,
      resolve: ({ assetCommentId }) => assetCommentId
    }
  },
  mutateAndGetPayload: ({ id }, context) => {
    var assetCommentId = fromGlobalId(id).id;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('assetComments').read(assetCommentId).then(function (assetComment) {
        assetComment.__api__.delete().then(function () {
          resolve({
            assetCommentId
          });
        });
      }).catch(reject);
    });
  }
});

export { createAssetComment, deleteAssetComment };
