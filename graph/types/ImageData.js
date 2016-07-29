import { GraphQLString, GraphQLObjectType } from './standard';
import request from 'request';

let queryType = new GraphQLObjectType({
  name: 'ImageData',
  description: 'The query root of the schema',
  fields: () => ({
    string: {
      type: GraphQLString,
      resolve: url => url
    },
    data: {
      type: GraphQLString,
      resolve: uri => new Promise((resolve, reject) => {
        request({ uri, encoding: 'binary' }, (error, { headers, statusCode }, body) => {
          if (!error && statusCode === 200) {
            const type = headers['content-type'];
            const encodedImage = new Buffer(body.toString(), 'binary').toString('base64');
            resolve(`data:${type};base64,${encodedImage}`);
          } else {
            reject(error);
          }
        });
      })
    }
  })
});

export default queryType;
