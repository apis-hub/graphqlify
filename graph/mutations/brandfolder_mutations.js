import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLBrandfolderEdge, brandfolderType } from '../types/brandfolder_type';
import { organizationType }       from '../types/organization_type';
import { GraphQLifiedJsonAPI } from '../../adapters/api_adapter';

const createBrandfolder = mutationWithClientMutationId({
    name: 'createBrandfolder',
    inputFields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        organization_id: { type: new GraphQLNonNull(GraphQLID)}
    },
    outputFields: {
        brandfolder: {
            type: brandfolderType,
            resolve: ({brandfolder}) => {
                return brandfolder;
            }
        },
        organization: {
            type: organizationType,
            resolve: ({ organizationId, rootContext}) => {
                return new Promise(function (resolve, reject){
                    rootContext.rootValue.client.resource('organizations').read(organizationId).then(function(organization){
                        resolve(organization)
                    }).catch(reject);
                })

            }
        }
    },
    mutateAndGetPayload: ({name, organization_id}, context) => {
        const organizationId = organization_id;
        const rootContext = context;
        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('organizations').read(organizationId).then(function(organization){
                organization.__api__.related('brandfolders').then(function(brandfolders){
                    brandfolders.create('brandfolders', {name: name}).then(function(brandfolder){
                        resolve( {brandfolder, organizationId, rootContext })
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        })
    }
});

const updateBrandfolder = mutationWithClientMutationId({
    name: 'updateBrandfolder',
    inputFields: {
        id:                     { type: new GraphQLNonNull(GraphQLID) },
        name:                   { type: GraphQLString},
        tagline:                { type: GraphQLString },
        is_public:              { type: GraphQLBoolean },
        stealth:                { type: GraphQLBoolean },
        request_access_enabled: { type: GraphQLBoolean },
        request_access_prompt:  { type: GraphQLString },
        slug:                   { type: GraphQLString },
        google_analytics_id:    { type: GraphQLID },
        whitelisted_domains:    { type: GraphQLString},
        enable_simple_password: { type: GraphQLBoolean }
    },
    outputFields: {
        brandfolder: {
            type: brandfolderType,
            resolve: ({brandfolder}) => {
                return brandfolder;
            }
        }
    },
    mutateAndGetPayload: ({id, name, tagline, is_public, stealth, request_access_enabled, request_access_prompt,
                            slug, google_analytics_id, whitelisted_domains, enable_simple_password}, context) => {
        const brandfolderId = id;
        var brandfolderName=name,
            brandfolderTagline=tagline,
            brandfolderIs_public=is_public,
            brandfolderStealth=stealth,
            brandfolderRequest_access_enabled=request_access_enabled,
            brandfolderRequest_acess_prompt=request_access_prompt,
            brandfolderSlug=slug,
            brandfolderGoogle_analytics_id=google_analytics_id,
            brandfolderWhitelisted_domains=whitelisted_domains,
            brandfolderEnable_simple_password=enable_simple_password;

        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('brandfolders').read(brandfolderId).then(function (brandfolder) {
                if (brandfolderName) { brandfolder.name = brandfolderName }
                if (brandfolderTagline) { brandfolder.tagline = brandfolderTagline}
                if (brandfolderIs_public) { brandfolder.public = brandfolderIs_public}
                if (brandfolderStealth) { brandfolder.stealth = brandfolderStealth }

                brandfolder.__api__.save().then(function(brandfolder){
                    resolve({brandfolder});
                }).catch(reject);
            }).catch(reject);
        })
               //.update(brandfolderId, {name: name, tagline: tagline, public: is_public, stealth: stealth,
               //                       request_access_enabled: request_access_enabled, request_access_prompt: request_access_prompt,
               //                       slug: slug, google_analytics_id: google_analytics_id, organization_id: organization_id,
               //                       whitelisted_domains: whitelisted_domains, enable_simple_password: enable_simple_password,
               //                       card_image: card_image, header_image: header_image})
               //.then(result=> { return { brandfolderId: result.id}; });
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