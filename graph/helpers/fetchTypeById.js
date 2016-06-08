import { parseResponseOptions } from './apiHelpers';
import { paramsFromResolveInfo } from './contextHelpers';

function fetchTypeById(type, id, api, resolveInfo, params = {}, path = []) {
  let resource = api.resource(type);
  return resource.new({ id }).options().then(
    parseResponseOptions('GET')
  ).then(
    paramsFromResolveInfo(params, resolveInfo, path)
  ).then(
    reqParams => resource.read(id, reqParams)
  );
}

export default fetchTypeById;
