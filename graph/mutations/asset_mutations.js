import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';
import { assetType } from '../types/Asset';
import { sectionType } from '../types/section_type';
import { reusableDataType } from '../types/reusable_data_type';

const createAsset = mutationWithClientMutationId({
  name: 'createAsset',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: GraphQLString
    },
    asset_data: {
      type: reusableDataType
    },
    tag_names: {
      type: GraphQLString
    },
    section_id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    asset: {
      type: assetType,
      resolve: ({ asset }) => asset
    },
    section: {
      type: sectionType,
      resolve: ({ sectionId, rootContext }) => {
        return new Promise(function (resolve, reject) {
          rootContext.rootValue.client.resource('sections').read(sectionId).then(function (section) {
            resolve(section);
          }).catch(reject);
        });
      }
    },
  },
  mutateAndGetPayload: ({ name, description, asset_data, tag_names, section_id } , context) => {
    const sectionId = section_id;
    const rootContext = context;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('sections').read(sectionId).then(function (section) {
        section.__api__.related('assets').then(function (assets) {
          assets.create('assets', {
            name: name,
            description: description,
            asset_data: asset_data,
            tag_names: tag_names
          }).then(function (asset) {
            resolve({
              asset,
              sectionId,
              rootContext
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  },
});

const updateAsset = mutationWithClientMutationId({
  name: 'updateAsset',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    description: {
      type: GraphQLString
    },
    asset_data: {
      type: reusableDataType
    },
    tag_names: {
      type: GraphQLString
    }
  },
  outputFields: {
    asset: {
      type: assetType,
      resolve: ({ asset }) => asset
    }
  },
  mutateAndGetPayload: ({ id, description, asset_data, tag_names } , context) => {
    const assetId = fromGlobalId(id).id;
    var assetDescription = description,
      assetData = asset_data,
      assetTagNames = tag_names;

    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('assets').read(assetId).then(function (asset) {
        if (assetDescription) {
          asset.description = assetDescription;
        }
        if (assetData) {
          asset.asset_data = assetData;
        }
        if (assetTagNames) {
          asset.tag_names = assetTagNames;
        }

        asset.__api__.update(asset).then(function (asset) {
          resolve({
            asset
          });
        }).catch(reject);
      }).catch(reject);
    });
  }
});

const removeSectionAssets = mutationWithClientMutationId({
  name: 'removeSectionAssets',
  inputFields: {
    section_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
  },
  outputFields: {
    section: {
      type: sectionType,
      resolve: ({ sectionId, rootContext }) => {
        return new Promise(function (resolve, reject) {
          rootContext.rootValue.client.resource('sections').read(sectionId).then(function (section) {
            resolve(section);
          }).catch(reject);
        });
      }
    }
  },
  mutateAndGetPayload: ({ section_id }, context) => {
    var sectionId = fromGlobalId(section_id).id,
      rootContext = context;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('sections').read(sectionId).then(function (section) {
        section.__api__.relationship('assets').then(function (assetRelationships) {
          assetRelationships.remove(assetRelationships);
          resolve({
            sectionId,
            rootContext
          });
        });
      }).catch(reject);
    });
  }
});

export { createAsset, updateAsset, removeSectionAssets };
