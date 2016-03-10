import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import _ from 'lodash';
import * as types from '../types/standard';
import { catchUnauthorized } from './catchErrors';
import buildAttributesType from './buildAttributesType';

// Root Resource Mutation
function buildRootResourceMutations(options) {
  options = options instanceof Function ? options() : options;
  var { inputFields: attributesFields = {}, type, outputFields = {} } = options;
  var name = type.type.name;
  var { createAttributesType, updateAttributesType } = buildAttributesType(name, attributesFields);

  outputFields[_.snakeCase(name)] = {
    type: type.type,
    resolve: ({ resultResponse }) => resultResponse
  };

  // Build the Mutations
  var mutations = {};

  // Build the create mutation
  mutations[`create${name}`] = mutationWithClientMutationId({
    name: `create${name}`,
    inputFields: {
      attributes: {
        type: createAttributesType
      }
    },
    outputFields,
    mutateAndGetPayload: ({ attributes }, { rootValue }) => {
      return rootValue.api.resource(type.resource).create({ attributes }).then(
        resultResponse => ({ resultResponse })
      ).catch(
        catchUnauthorized(rootValue)
      );
    }
  });

  // Build the update mutation
  mutations[`update${name}`] = mutationWithClientMutationId({
    name: `update${name}`,
    inputFields: {
      id: {
        type: new types.GraphQLNonNull(types.GraphQLID)
      },
      attributes: {
        type: updateAttributesType
      }
    },
    outputFields,
    mutateAndGetPayload: ({ id: globalId, attributes }, { rootValue }) => {
      var { id } = fromGlobalId(globalId);
      return rootValue.api.resource(type.resource).read(id).then(({ instance }) => {
        return instance.updateAttributes(attributes);
      }).then(
        resultResponse => ({ resultResponse })
      ).catch(
        catchUnauthorized(rootValue)
      );
    }
  });

  // Build the delete mutation
  mutations[`delete${name}`] = mutationWithClientMutationId({
    name: `delete${name}`,
    inputFields: {
      id: {
        type: new types.GraphQLNonNull(types.GraphQLID)
      }
    },
    outputFields,
    mutateAndGetPayload: ({ id: globalId }, { rootValue }) => {
      var { id } = fromGlobalId(globalId);
      return rootValue.api.resource(type.resource).read(id).then(({ instance }) => {
        return instance.delete();
      }).then(
        resultResponse => ({ resultResponse })
      ).catch(
        catchUnauthorized(rootValue)
      );
    }
  });

  return mutations;
}

export default buildRootResourceMutations;
