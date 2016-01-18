const getbabelRelayPlugin = require('babel-relay-plugin');
const schema = require('../public/schema.json');

export default getbabelRelayPlugin(schema.data);