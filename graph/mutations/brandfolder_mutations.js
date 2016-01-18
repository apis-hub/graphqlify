import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLBrandfolderEdge } from '../types/brandfolder_type';
import { organizationType }       from '../types/organization_type';
import api                       from '../../adapters/api_adapter';

const createBrandfolder = mutationWithClientMutationId({
    name: 'CreateBrandfolder',
    inputFields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        organization_id: { type: new GraphQLNonNull(GraphQLID)}
    },
    outputFields: {
        brandfolderEdge: {
            type: GraphQLBrandfolderEdge,
            resolve: ({brandfolderId}) => {
                const brandfolder = api.getType('brandfolder').find(brandfolderId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('brandfolder').all(), brandfolder),
                    node: brandfolder
                };
            }
        },
        organization: {
            type: organizationType,
            resolve: ({localOrganizationId}) => {
                api.getType('organization').find({localOrganizationId});
            }
        }
    },
    mutateAndGetPayload: ({name, organization_id}) => {
        const localOrganizationId = fromGlobalId(organization_id).id;
        api.getType('brandfolder')
               .create({name: name, organization_id: localOrganizationId})
               .then(result => { return { brandfolderId: result.id, localOrganizationId, }; });
    },
});

const updateBrandfolder = mutationWithClientMutationId({
    name: 'UpdateBrandfolder',
    inputFields: {
        id:                     { type: new GraphQLNonNull(GraphQLID) },
        name:                   { type: new GraphQLNonNull(GraphQLString) },
        tagline:                { type: GraphQLString },
        is_public:              { type: GraphQLBoolean },
        stealth:                { type: GraphQLBoolean },
        request_access_enabled: { type: GraphQLBoolean },
        request_access_prompt:  { type: GraphQLString },
        slug:                   { type: new GraphQLNonNull(GraphQLString) },
        google_analytics_id:    { type: GraphQLID },
        organization_id:        { type: GraphQLID },
        whitelisted_domains:    { type: new GraphQLList(GraphQLString)},
        enable_simple_password: { type: GraphQLBoolean },
        card_image:             { type: GraphQLString },
        header_image:           { type: GraphQLString },
    },
    outputFields: {
        brandfolderEdge: {
            type: GraphQLBrandfolderEdge,
            resolve: ({brandfolderId}) => {
                const brandfolder = api.getType('brandfolder').find(brandfolderId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('brandfolder').all(), brandfolder),
                    node: brandfolder
                };
            }
        }

    },
    mutateAndGetPayload: ({id, name, tagline, is_public, stealth, request_access_enabled, request_access_prompt,
                            slug, google_analytics_id, organization_id, whitelisted_domains, enable_simple_password,
                            card_image, header_image }) => {
        const brandfolderId = fromGlobalId(id).id;
        api.getType('brandfolder')
               .update(brandfolderId, {name: name, tagline: tagline, public: is_public, stealth: stealth,
                                      request_access_enabled: request_access_enabled, request_access_prompt: request_access_prompt,
                                      slug: slug, google_analytics_id: google_analytics_id, organization_id: organization_id,
                                      whitelisted_domains: whitelisted_domains, enable_simple_password: enable_simple_password,
                                      card_image: card_image, header_image: header_image})
               .then(result=> { return { brandfolderId: result.id}; });
        },
});

const deleteBrandfolder = mutationWithClientMutationId({
    name: 'DeleteBrandfolder',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
       brandfolderEdge: {
           type: GraphQLBrandfolderEdge,
           resolve: () => null
       }
    },
    mutateAndGetPayload: ({id}) => {
        var brandfolderId = fromGlobalId(id).id;
        api.getType('brandfolder').remove(brandfolderId);
    }
});

export { createBrandfolder, updateBrandfolder, deleteBrandfolder };