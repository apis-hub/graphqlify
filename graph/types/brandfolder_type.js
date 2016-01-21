import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString,
    GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { connectionArgs, connectionFromPromisedArray, globalIdField, connectionDefinitions } from 'graphql-relay';

import { nodeInterface }            from '../node_identification';
import { slugInterface }            from '../slug_identification';
import { collectionConnection }     from './collection_type';
import { sectionConnection }        from './section_type';
import { eventConnection }          from './event_type';
import { socialLinkConnection }     from './social_link_type';
import { userConnection }           from './user_type';
import { userPermissionConnection } from './user_permission_type';
import { invitationConnection }     from './invitation_type';
import { assetConnection }          from './asset_type';

var brandfolderType = new GraphQLObjectType({
    name:        'Brandfolder',
    description: 'A brandfolder item',
    fields:      () => ({
        id:                     globalIdField('brandfolder'),
        name:                   { type: new GraphQLNonNull(GraphQLString) },
        tagline:                { type: GraphQLString },
        public:                 { type: GraphQLBoolean },
        stealth:                { type: GraphQLBoolean },
        request_access_enabled: { type: GraphQLBoolean },
        request_access_prompt:  { type: GraphQLString },
        slug:                   { type: new GraphQLNonNull(GraphQLString) },
        google_analytics_id:    { type: GraphQLID },
        organization_id:        { type: GraphQLID },
        whitelisted_domains:    { type: new GraphQLList(GraphQLString) },
        enable_simple_password: { type: GraphQLBoolean },
        //card_image:             { type: GraphQLString },
        //header_image:           { type: GraphQLString },
        //created_at:             { type: GraphQLString },
        //updated_at:             { type: GraphQLString },
        collections:            {
            type:        collectionConnection,
            description: 'The collection used by the brandfolder',
            args:        connectionArgs,
            resolve:     (brandfolder, args) => connectionFromPromisedArray(
                brandfolder.related('collections'), args
            )
        },
        sections:               {
            type:        sectionConnection,
            description: 'The section used by thte brandfolder',
            args:        connectionArgs,
            resolve:     (brandfolder, args) => connectionFromPromisedArray(
                brandfolder.related('sections'), args
            )
        },
        //events:                 {
        //    type:        eventConnection,
        //    description: 'The event tied to the brandfolder',
        //    args:        connectionArgs,
        //    resolve:     (brandfolder, args) => connectionFromPromisedArray(
        //        brandfolder.related('collectio'), args
        //    )
        //},
        social_links:           {
            type:        socialLinkConnection,
            description: 'The link tied to the brandfolder',
            args:        connectionArgs,
            resolve:     (brandfolder, args) => connectionFromPromisedArray(
                brandfolder.related('social_links'), args
            )
        },
        admins:                 {
            type:        userConnection,
            description: 'The admins tied to the brandfolder',
            args:        connectionArgs,
            resolve:     (brandfolder, args) => connectionFromPromisedArray(
                brandfolder.related('admins'), args
            )
        },
        collaborators:          {
            type:        userConnection,
            description: 'The collaborators tied to the brandfolder',
            args:        connectionArgs,
            resolve:     (brandfolder, args) => connectionFromPromisedArray(
                brandfolder.related('collaborators'), args
            )
        },
        guests:                 {
            type:        userConnection,
            description: 'The guests tied to the brandfolder',
            args:        connectionArgs,
            resolve:     (brandfolder, args) => connectionFromPromisedArray(
                brandfolder.related('guests'), args
            )
        },
        users:                  {
            type:        userConnection,
            description: 'The users tied to the brandfolder',
            args:        connectionArgs,
            resolve:     (brandfolder, args) => connectionFromPromisedArray(
                brandfolder.related('users'), args
            )
        },
        user_permissions:       {
            type:        userPermissionConnection,
            description: 'The user permissions tied to the brandfolder',
            args:        connectionArgs,
            resolve:     (brandfolder, args) => connectionFromPromisedArray(
                brandfolder.related('user_permissions'), args
            )
        },
        assets:                 {
            type:        assetConnection,
            description: 'The assets tied to the brandfolder',
            args:        connectionArgs,
            resolve:     (brandfolder, args) => connectionFromPromisedArray(
                brandfolder.related('assets'), args
            )
        },
        invitations:            {
            type:        invitationConnection,
            description: 'The invitations tied to the brandfolder',
            args:        connectionArgs,
            resolve:     (brandfolder, args) => connectionFromPromisedArray(
                brandfolder.related('invitations'), args
            )
        },

    }),
    interfaces:  [nodeInterface, slugInterface]
});

var { connectionType: brandfolderConnection, edgeType: GraphQLBrandfolderEdge } =
        connectionDefinitions({ name: 'brandfolder', nodeType: brandfolderType });

export {brandfolderType, brandfolderConnection, GraphQLBrandfolderEdge };