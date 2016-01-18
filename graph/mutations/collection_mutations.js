import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLCollectionEdge } from '../types/collection_type';
import { brandfolderType }       from '../types/brandfolder_type';
import { reusableDataType }      from '../types/reusable_data_type';
import api                       from '../../adapters/api_adapter';

const createCollection = mutationWithClientMutationId({
    name: 'CreateCollection',
    inputFields: {
        name:           { type: new GraphQLNonNull(GraphQLString) },
        slug:           { type: new GraphQLNonNull(GraphQLString) },
        is_public:      { type: GraphQLBoolean },
        stealth:        { type: GraphQLBoolean },
        options:        { type: reusableDataType },
        brandfolder_id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        collectionEdge: {
            type: GraphQLCollectionEdge,
            resolve: ({collectionId}) => {
                const collection = api.getType('collection').find(collectionId);
                return {
                    cursor: cursorForObjectInConnection(adapter.getType('collection').all(), collection),
                    node: collection
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
    mutateAndGetPayload: ({name, brandfolder_id, is_public, slug, stealth, options}) => {
        const localBrandfolderId = fromGlobalId(brandfolder_id).id;
        api.getType('collection')
               .create({name: name, brandfolder_id: localBrandfolderId, public: is_public, slug: slug, stealth: stealth,
                        options: options})
               .then(result => { return { collectionId: result.id, localBrandfolderId, }; });
    },
});

const updateCollection = mutationWithClientMutationId({
    name: 'UpdateCollection',
    inputFields: {
        id:             { type: new GraphQLNonNull(GraphQLID) },
        name:           { type: new GraphQLNonNull(GraphQLString) },
        slug:           { type: new GraphQLNonNull(GraphQLString) },
        is_public:      { type: GraphQLBoolean },
        stealth:        { type: GraphQLBoolean },
        options:        { type: reusableDataType }
    },
    outputFields: {
        collectionEdge: {
            type: GraphQLCollectionEdge,
            resolve: ({collectionId}) => {
                const collection = api.getType('collection').find(collectionId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('collection').all(), collection),
                    node: collection
                };
            },
        },
    },
    mutateAndGetPayload: ({id, name, is_public, slug, stealth, options}) => {
        const collectionId = fromGlobalId(globalId).id;
        api.getType('collection')
               .update(collectionId, {name: name, slug: slug, public: is_public, stealth: stealth, options: options})
               .then(result=> { return { collectionId: result.id }; });
    },
});

const deleteCollection = mutationWithClientMutationId({
    name: 'DeleteCollection',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) }
    },
    outputFields: {
        collectionEdge: {
            type: GraphQLCollectionEdge,
            resolve: () => null
        }
    },
    mutateAndGetPayload: ({id }) => {
        var collectionId = fromGlobalId(id).id;
        api.getType('collection').remove(collectionId);
    }
});

export { createCollection, updateCollection, deleteCollection };