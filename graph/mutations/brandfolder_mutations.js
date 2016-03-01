import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList, GraphQLScalarType } from 'graphql/type';
import { mutationWithClientMutationId, cursorForObjectInConnection, fromGlobalId, connectionArgs } from 'graphql-relay';
import { brandfolderType } from '../types/brandfolder_type';
import { organizationType } from '../types/organization_type';

const createBrandfolder = mutationWithClientMutationId({
  name: 'createBrandfolder',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    organization_id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    brandfolder: {
      type: brandfolderType,
      resolve: ({ brandfolder }) => brandfolder
    },
    organization: {
      type: organizationType,
      resolve: ({ organizationId, rootContext }) => {
        return new Promise(function (resolve, reject) {
          rootContext.rootValue.client.resource('organizations').read(organizationId).then(function (organization) {
            resolve(organization);
          }).catch(reject);
        });
      }
    }
  },
  mutateAndGetPayload: ({ name, organization_id } , context) => {
    const organizationId = fromGlobalId(organization_id).id;
    const rootContext = context;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('organizations').read(organizationId).then(function (organization) {
        organization.__api__.related('brandfolders').then(function (brandfolders) {
          brandfolders.create('brandfolders', {
            name: name
          }).then(function (brandfolder) {
            resolve({
              brandfolder,
              organizationId,
              rootContext
            });
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    });
  }
});

const updateBrandfolder = mutationWithClientMutationId({
  name: 'updateBrandfolder',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    tagline: {
      type: GraphQLString
    },
    is_public: {
      type: GraphQLBoolean
    },
    stealth: {
      type: GraphQLBoolean
    },
    request_access_enabled: {
      type: GraphQLBoolean
    },
    request_access_prompt: {
      type: GraphQLString
    },
    slug: {
      type: GraphQLString
    },
    google_analytics_id: {
      type: GraphQLID
    },
    whitelisted_domains: {
      type: GraphQLString
    },
    enable_simple_password: {
      type: GraphQLBoolean
    }
  },
  outputFields: {
    brandfolder: {
      type: brandfolderType,
      resolve: ({ brandfolder }) => brandfolder
    }
  },
  mutateAndGetPayload: ({ id, name, tagline, is_public, stealth, request_access_enabled, request_access_prompt, slug, google_analytics_id, whitelisted_domains, enable_simple_password } , context) => {
    const brandfolderId = fromGlobalId(id).id;
    var brandfolderName = name,
      brandfolderTagline = tagline,
      brandfolderIs_public = is_public,
      brandfolderStealth = stealth,
      brandfolderRequest_access_enabled = request_access_enabled,
      brandfolderRequest_access_prompt = request_access_prompt,
      brandfolderSlug = slug,
      brandfolderGoogle_analytics_id = google_analytics_id,
      brandfolderWhitelisted_domains = whitelisted_domains,
      brandfolderEnable_simple_password = enable_simple_password;

    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('brandfolders').read(brandfolderId).then(function (brandfolder) {
        if (brandfolderName) {
          brandfolder.name = brandfolderName;
        }
        if (brandfolderTagline) {
          brandfolder.tagline = brandfolderTagline;
        }
        if (brandfolderIs_public) {
          brandfolder.public = brandfolderIs_public;
        }
        if (brandfolderStealth) {
          brandfolder.stealth = brandfolderStealth;
        }
        if (brandfolderRequest_access_enabled) {
          brandfolder.request_access_enabled = brandfolderRequest_access_enabled;
        }
        if (brandfolderRequest_access_prompt) {
          brandfolder.request_access_prompt = brandfolderRequest_access_prompt;
        }
        if (brandfolderSlug) {
          brandfolder.slug = brandfolderSlug;
        }
        if (brandfolderGoogle_analytics_id) {
          brandfolder.google_analytics_id = brandfolderGoogle_analytics_id;
        }
        if (brandfolderWhitelisted_domains) {
          brandfolder.whitelisted_domains = brandfolderWhitelisted_domains;
        }
        if (brandfolderEnable_simple_password) {
          brandfolder.enable_simple_password = brandfolderEnable_simple_password;
        }

        brandfolder.__api__.update(brandfolder).then(function (brandfolder) {
          resolve({
            brandfolder
          });
        }).catch(reject);
      }).catch(reject);
    });
  }
});

const deleteBrandfolder = mutationWithClientMutationId({
  name: 'deleteBrandfolder',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
  },
  outputFields: {
    deletedId: {
      type: GraphQLID,
      resolve: ({ brandfolderId }) => brandfolderId
    }
  },
  mutateAndGetPayload: ({ id }, context) => {
    var brandfolderId = fromGlobalId(id).id;
    return new Promise(function (resolve, reject) {
      context.rootValue.client.resource('brandfolders').read(brandfolderId).then(function (brandfolder) {
        brandfolder.__api__.delete().then(function () {
          resolve({
            brandfolderId
          });
        });
      }).catch(reject);
    });
  }
});
export { createBrandfolder, updateBrandfolder, deleteBrandfolder };
