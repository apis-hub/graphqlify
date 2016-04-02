import { parseResponseOptions } from './apiHelpers';
import { paramsFromContext } from './contextHelpers';

function fetchTypeById(type, id, context, params = {}, ...path) {
  let resource = context.rootValue.api.resource(type);
  return resource.new({ id }).options().then(
    parseResponseOptions('GET')
  ).then(
    paramsFromContext(params, context, ...path)
  ).then(
    reqParams => resource.read(id, reqParams)
  );
}

export default fetchTypeById;
