import requireType from '../helpers/requireType';
import { GraphQLObjectType } from './standard';

export const type = new GraphQLObjectType({
  name: 'ApiIndex',
  description: 'The Api indexes for various resource types',
  fields: () => ({
    ...requireType('Brandfolder').indexField
  })
});
