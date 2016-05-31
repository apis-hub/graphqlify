import deepmerge from 'deepmerge';

import requireType from '../helpers/requireType';
import resolveMaybeThunk from '../helpers/resolveMaybeThunk';
import ApiResourceType from '../builders/ApiResourceType';

const sectionConfig = requireType('Section').config.mapping;
const sectionType = new ApiResourceType(
  'SearchFilterSection',
  () => deepmerge(resolveMaybeThunk(sectionConfig), {
    relatesToOne: {
      search_filter: requireType('SearchFilter')
    },
  })
);

module.exports = sectionType;
