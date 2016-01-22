require('babel-register');
const makeWebpackConfig = require('./makeConfig').default;
module.exports = makeWebpackConfig(false);
