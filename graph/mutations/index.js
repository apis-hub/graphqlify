import { GraphQLObjectType } from 'graphql/type'
//import { createAssetGroup, updateAssetGroup, deleteAssetGroup }       from './asset_group_mutations';
import { createAssetComment, deleteAssetComment } from './asset_comments_mutations';
import { createAsset, updateAsset, deleteAsset }                         from './asset_mutations';
import { createAttachment, updateAttachment, deleteAttachment }          from './attachment_mutations';
import { createBrandfolder, updateBrandfolder, deleteBrandfolder }       from './brandfolder_mutations';
import { createCollection, updateCollection, deleteCollection }          from './collection_mutations';
//import { createEvent }                                                   from './event_mutations';
import { createInvitation, deleteInvitation }                            from './invitation_mutations';
import { createSocialLink, updateSocialLink, deleteSocialLink }          from './social_link_mutations';
import { createOrganization, updateOrganization, deleteOrganization }    from './organization_mutations';
import { createSection, updateSection, deleteSection }                   from './section_mutations';
//import { createShareManifest, deleteShareManifest}                       from './share_manifest_mutations';
import { createUser, updateUser, deleteUser }                            from './user_mutations';
import { createBrandfolderUserPermission,
         createCollectionUserPermission,
         createOrganizationUserPermission }                              from './user_permission_mutations';


var mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: ({
        createBrandfolder:      createBrandfolder,
        updateBrandfolder:      updateBrandfolder,
        deleteBrandfolder:      deleteBrandfolder,
        //createAssetGroup:    createAssetGroup,
        //updateAssetGroup:    updateAssetGroup,
        //deleteAssetGroup:    deleteAssetGroup,
        createAssetComment:     createAssetComment,
        deleteAssetComment:     deleteAssetComment,
        createAsset:            createAsset,
        updateAsset:         updateAsset,
        deleteAsset:            deleteAsset,
        createAttachment:       createAttachment,
        updateAttachment:    updateAttachment,
        deleteAttachment:       deleteAttachment,
        createCollection:       createCollection,
        updateCollection:    updateCollection,
        deleteCollection:       deleteCollection,
        //createEvent:         createEvent,
        createInvitation:       createInvitation,
        deleteInvitation:       deleteInvitation,
        createSocialLink:       createSocialLink,
        updateSocialLink:       updateSocialLink,
        deleteSocialLink:       deleteSocialLink,
        createOrganization:  createOrganization,
        updateOrganization:  updateOrganization,
        deleteOrganization:  deleteOrganization,
        createSection:          createSection,
        updateSection:       updateSection,
        deleteSection:          deleteSection,
        //createShareManifest: createShareManifest,
        //deleteShareManifes:  deleteShareManifest,
        createUser:             createUser,
        updateUser:          updateUser,
        deleteUser:             deleteUser,
        createBrandfolderUserPermission: createBrandfolderUserPermission,
        createCollectionUserPermission: createCollectionUserPermission,
        createOrganizationUserPermission: createOrganizationUserPermission

    })
});

export default mutationType;