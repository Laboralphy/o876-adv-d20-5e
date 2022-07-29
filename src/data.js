const TreeSync = require('../libs/tree-sync')
const path = require('path')
module.exports = TreeSync.recursiveRequire(path.resolve(__dirname, './data'), true)
