if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
require('babel-core/register');
require('./server.js');
