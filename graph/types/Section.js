import * as types from './standard';

import requireInterface from '../helpers/requireInterface';
import requireType from '../helpers/requireType';
import ApiResourceType from '../builders/ApiResourceType';
import { iface as sectionInterface, config as sectionConfig } from '../interfaces/Sectionable';

const sectionType = new ApiResourceType('Section', sectionConfig.mapping, sectionInterface);

module.exports = sectionType;
