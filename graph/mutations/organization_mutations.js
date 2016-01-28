import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID,
    GraphQLList,
    GraphQLScalarType
} from "graphql/type";
import {
    mutationWithClientMutationId,
    cursorForObjectInConnection,
    fromGlobalId,
    connectionArgs
} from "graphql-relay";
import {
    GraphQLOrganizationEdge,
    organizationType
} from "../types/organization_type";
import api from "../../adapters/api_adapter";

const createOrganization = mutationWithClientMutationId({
    name: 'createOrganization',
    inputFields: {
        name: { type: GraphQLString },
        slug: { type: new GraphQLNonNull(GraphQLString) }
    },
    outputFields: {
        organization: {
            type: organizationType,
            resolve: ({ organization }) => organization
        }
    },
    mutateAndGetPayload: ({ name, slug }, context) => {
        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('organizations').index().then(function (organizations) {
                organizations.create('organizations', {
                    name: name,
                    slug: slug
                }).then(function (organization) {
                    resolve({ organization })
                }).catch(reject);
            }).catch(reject);
        })
    }
});

const updateOrganization = mutationWithClientMutationId({
    name: 'updateOrganization',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        slug: { type: GraphQLString }
    },
    outputFields: {
        organization: {
            type: organizationType,
            resolve: ({ organization }) => organization
        }
    },
    mutateAndGetPayload: ({ id, name, slug }) => {
        const organizationId = id;
        var organizationName = name,
            organizationSlug = slug;

        return new Promise(function (resolve, reject) {
            context.rootValue.client.resource('organizations').read(organizationId).then(function (organization) {
                if (organizationName) {
                    organization.name = organizationName
                }
                if (organizationSlug) {
                    organization.slug = organizationSlug
                }

                organization.__api__.update(organization).then(function (organization) {
                    resolve({ organization });
                }).catch(reject);
            }).catch(reject);
        })
    }
});

const deleteOrganization = mutationWithClientMutationId({
    name: 'deleteOrganization',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        organizationEdge: {
            type: GraphQLOrganizationEdge,
            resolve: () => null
        }
    },
    mutateAndGetPayload: ({ id }) => {
        var organizationId = fromGlobalId(id).id;
        api.getType('organization').remove(organizationId);
    }
});

export { createOrganization, updateOrganization, deleteOrganization };
