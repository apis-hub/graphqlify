import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLSectionEdge } from '../types/section_type';
import { brandfolderType }    from '../types/brandfolder_type';
import api                    from '../../adapters/api_adapter';

const createSection = mutationWithClientMutationId({
    name: 'CreateSection',
    inputFields: {
        name:               { type: new GraphQLNonNull(GraphQLString) },
        default_asset_type: { type: new GraphQLNonNull(GraphQLString) },
        position:           { type: GraphQLInt },
        brandfolder_id:     { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        sectionEdge: {
            type: GraphQLSectionEdge,
            resolve: ({sectionId}) => {
                const section = aapi.getType('section').find(sectionId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('section').all(), section),
                    node: section
                };
            }
        },
        brandfolder: {
            type: brandfolderType,
            resolve: ({localBrandfolderId}) => {
                api.getType('brandfolder').find(localBrandfolderId);
            }
        }
    },
    mutateAndGetPayload: ({name, default_asset_type, position, brandfolder_id}) => {
        const localBrandfolderId = fromGlobalId(brandfolder_id).id;
       api.getType('section')
               .create({name: name, default_asset_type: default_asset_type, position: position, brandfolder_id: localBrandfolderId})
               .then(result => { return { sectionId: result.id,  localBrandfolderId } });
    },
});

const updateSection = mutationWithClientMutationId({
    name: 'UpdateSection',
    inputFields: {
        id:                 { type: new GraphQLNonNull(GraphQLID) },
        name:               { type: new GraphQLNonNull(GraphQLString) },
        default_asset_type: { type: new GraphQLNonNull(GraphQLString) },
        position:           { type: GraphQLInt }
    },
    outputFields: {
      sectionEdge: {
          type: GraphQLSectionEdge,
          resolve: ({sectionId}) => {
              const section = api.getType('section').find(sectionId);
              return {
                  cursor: cursorForObjectInConnection(api.getType('section').all(), section),
                  node: section
              };
          },
      },
    },
    mutateAndGetPayload: ({ id, name, default_asset_type, position }) => {
        const sectionId = fromGlobalId(id).id;
        api.getType('section')
               .update(sectionId, {name: name, default_asset_type: default_asset_type, position: position})
               .then(result => { return { sectionId: result.id }; });
    },
});

const deleteSection = mutationWithClientMutationId({
    name: 'DeleteSection',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        sectionEdge: {
            type: GraphQLSectionEdge,
            resolve: () => null
        }
    },
    mutateAndGetPayload: ({id}) => {
        var sectionId = fromGlobalId(id).id;
        api.getType('section').remove(sectionId);
    }
});

export { createSection, updateSection, deleteSection };