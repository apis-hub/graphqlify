import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLSocialLinkEdge } from '../types/social_link_type';
import { brandfolderType }       from '../types/brandfolder_type';
import api                       from '../../adapters/api_adapter';

const createSocialLink = mutationWithClientMutationId({
    name: 'CreateSocialLink',
    inputFields: {
        name:           { type: new GraphQLNonNull(GraphQLString) },
        url:            { type: new GraphQLNonNull(GraphQLString) },
        position:       { type: GraphQLInt },
        brandfolder_id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        linkEdge: {
            type: GraphQLSocialLinkEdge,
            resolve: ({linkId}) => {
                const link = api.getType('socialLink').find(linkId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('socialLink').all(), link),
                    node: link
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
    mutateAndGetPayload: ({ name, url, position, brandfolder_id }) => {
        const localBrandfolderId = fromGlobalId(brandfolder_id).id;
        api.getType('socialLink').create({});

        api.getType('socialLink')
               .create({ name: name, url: url , position: position, brandfolder_id: localBrandfolderId})
               .then(result => { return { linkId: result.id,  localBrandfolderId, }; });
    },
});


const deleteSocialLink = mutationWithClientMutationId({
    name: 'DeleteSocialLink',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        linkEdge: {
            type: GraphQLSocialLinkEdge,
            resolve: () => null
        }
    },
    mutateAndGetPayload: ({id}) => {
        var linkId = fromGlobalId(id).id;
        api.getType('socialLink').remove(linkId);
    }
});

export { createSocialLink, deleteSocialLink };