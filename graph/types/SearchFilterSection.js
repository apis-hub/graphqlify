import deepmerge from 'deepmerge';

import requireInterface from '../helpers/requireInterface';
import requireType from '../helpers/requireType';
import resolveMaybeThunk from '../helpers/resolveMaybeThunk';
import ApiResourceType from '../builders/ApiResourceType';
import { iface as sectionInterface, config as sectionConfig } from '../interfaces/Sectionable';

const sectionType = new ApiResourceType(
  'SearchFilterSection',
  () => deepmerge(resolveMaybeThunk(sectionConfig.mapping), {
    relatesToOne: {
      search_filter: requireType('SearchFilter')
    },
  }),
sectionInterface);

module.exports = sectionType;
