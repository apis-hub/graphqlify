import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';
import { sectionType } from '../types/section_type';
import { brandfolderType } from '../types/brandfolder_type';

const createSection = mutationWithClientMutationId({
  name: 'createSection',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    default_asset_type: {
      type: new GraphQLNonNull(GraphQLString)
    },
    brandfolder_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
  },
  outputFields: {
    section: {
      type: sectionType,
      resolve: ({ section }) => section
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
  mutateAndGetPayload: ({ name, default_asset_type, brandfolder_id } , context) => {
    const brandfolderId = fromGlobalId(brandfolder_id);
    const rootContext = context;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('brandfolders').read(brandfolderId).then(function (brandfolder) {
        brandfolder.__api__.related('sections').then(function (sections) {
          sections.create(
            'sections',
            {
              name: name,
              default_asset_type: default_asset_type
            }
          ).then(function (section) {
            resolve({
              section,
              brandfolderId,
              rootContext
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  }
});

const updateSection = mutationWithClientMutationId({
  name: 'updateSection',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    default_asset_type: {
      type: GraphQLString
    },
    position: {
      type: GraphQLInt
    }
  },
  outputFields: {
    section: {
      type: sectionType,
      resolve: ({ section }) => section
    }
  },
  mutateAndGetPayload: ({ id, name, default_asset_type, position } , context) => {
    const sectionId = fromGlobalId(id).id;
    var sectionName = name,
      sectionDefaultAssetType = default_asset_type,
      sectionPosition = position;

    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('sections').read(sectionId).then(function (section) {
        if (sectionName) {
          section.name = sectionName;
        }
        if (sectionDefaultAssetType) {
          section.default_asset_type = sectionDefaultAssetType;
        }
        if (sectionPosition) {
          section.position = sectionPosition;
        }

        section.__api__.update(section).then(function (section) {
          resolve({
            section
          });
        }).catch(reject);
      }).catch(reject);
    });
  }
});

const deleteSection = mutationWithClientMutationId({
  name: 'deleteSection',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
  },
  outputFields: {
    deletedId: {
      type: GraphQLID,
      resolve: ({ sectionId }) => sectionId
    }
  },
  mutateAndGetPayload: ({ id }, context) => {
    var sectionId = fromGlobalId(id).id;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('sections').read(sectionId).then(function (section) {
        section.__api__.delete().then(function () {
          resolve({
            sectionId
          });
        });
      }).catch(reject);
    });
  }
});

export { createSection, updateSection, deleteSection };
