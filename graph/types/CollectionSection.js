import deepmerge from 'deepmerge';

import requireType from '../helpers/requireType';
import resolveMaybeThunk from '../helpers/resolveMaybeThunk';
import ApiResourceType from '../builders/ApiResourceType';

const sectionConfig = requireType('Section').config.mapping;
const sectionType = new ApiResourceType(
  'CollectionSection',
  () => deepmerge(resolveMaybeThunk(sectionConfig), {
    relatesToOne: {
      collection: requireType('Collection')
    },
  })
);

module.exports = sectionType;
