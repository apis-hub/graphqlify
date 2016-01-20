import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLBrandfolderEdge, brandfolderType } from '../types/brandfolder_type';
import { organizationType }       from '../types/organization_type';
import { APIAdapter } from '../../adapters/api_adapter';

const createBrandfolder = mutationWithClientMutationId({
    name: 'createBrandfolder',
    inputFields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        organization_id: { type: new GraphQLNonNull(GraphQLID)}
    },
    outputFields: {
        brandfolderEdge: {
            type: GraphQLBrandfolderEdge,
            resolve: ({brandfolderId}, context) => {
                const brandfolder = context.rootValue.client.resource('brandfolders').read(brandfolderId);
                return {
                    cursor: cursorForObjectInConnection(context.rootValue.client.resource('brandfolders').index(), brandfolder),
                    node: brandfolder
                };
            }
        },
        organization: {
            type: organizationType,
            resolve: ({localOrganizationId}, context) => {
                context.rootValue.client.resource('organizations').read({localOrganizationId});
            }
        }
    },
    mutateAndGetPayload: ({name, organization_id}, context) => {
        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('organizations').read(organization_id).then(function(organization){
                organization.related('brandfolders').then(function(brandfolders){
                    brandfolders.create('brandfolders', {name: name}).then(resolve).catch(reject);
                }).catch(reject);
            }).catch(reject);
        })
    }
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
            resolve: ({brandfolderId}, context) => {
                const brandfolder = context.rootValue.client.getType('brandfolders').find(brandfolderId);
                return {
                    cursor: cursorForObjectInConnection(context.rootValue.client.getType('brandfolders').all(), brandfolder),
                    node: brandfolder
                };
            }
        }

    },
    mutateAndGetPayload: ({id, name, tagline, is_public, stealth, request_access_enabled, request_access_prompt,
                            slug, google_analytics_id, organization_id, whitelisted_domains, enable_simple_password,
                            card_image, header_image }, context) => {
        const brandfolderId = fromGlobalId(id).id;
        context.rootValue.client.getType('brandfolder')
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
    mutateAndGetPayload: ({id}, context) => {
        var brandfolderId = fromGlobalId(id).id;
        context.rootValue.client.getType('brandfolder').remove(brandfolderId);
    }
});

export { createBrandfolder, updateBrandfolder, deleteBrandfolder };