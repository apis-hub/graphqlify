import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';

import { GraphQLOrganizationEdge } from '../types/organization_type';
import api                         from '../../adapters/api_adapter';

const createOrganization = mutationWithClientMutationId({
    name: 'CreateOrganization',
    inputFields: {
        name:                { type: GraphQLString },
        slug:                { type: new GraphQLNonNull(GraphQLString) },
        branded_login_image: { type: GraphQLString },
    },
    outputFields: {
        organizationEdge: {
            type: GraphQLOrganizationEdge,
            resolve: ({organizationId}) => {
                const organization = api.getType('organization').find(organizationId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('organization').all(), organization),
                    node: organization
                };
            }
        }
    },
    mutateAndGetPayload: ({name, slug, branded_login_image }) => {
       api.getType('organization')
               .create({name: name, slug: slug, branded_login_image: branded_login_image})
               .then(result => { return { organizationId: result.id } });
    },
});

const updateOrganization = mutationWithClientMutationId({
    name: 'UpdateOrganization',
    inputFields: {
        id:                  { type: new GraphQLNonNull(GraphQLID) },
        name:                { type: GraphQLString },
        slug:                { type: new GraphQLNonNull(GraphQLString) },
        branded_login_image: { type: GraphQLString },
    },
    outputFields: {
        organizationEdge: {
            type: GraphQLOrganizationEdge,
            resolve: ({organizationId}) => {
                const organization = api.getType('organization').find(organizationId);
                return {
                    cursor: cursorForObjectInConnection(api.getType('organization').all(), organization),
                    node: organization
                }
            }
        }
    },
    mutateAndGetPayload: ({ id, name, slug, branded_login_image }) => {
        const organizationId = fromGlobalId(id).id;
        api.getType('organization')
               .update(organizationId, { name:name, slug:slug, branded_login_image: branded_login_image })
               .then(result => { return { organizationId: result.id}; });
    },
});

const deleteOrganization = mutationWithClientMutationId({
    name: 'DeleteOrganization',
    inputFields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
        organizationEdge: {
            type: GraphQLOrganizationEdge,
            resolve: () => null
        }
    },
    mutateAndGetPayload: ({id}) => {
        var organizationId = fromGlobalId(id).id;
        api.getType('organization').remove(organizationId);
    }
});

export { createOrganization, updateOrganization, deleteOrganization };