const getbabelRelayPlugin = require('babel-relay-plugin');
const schema = require('../graph/schema.json');

export default getbabelRelayPlugin(schema.data);