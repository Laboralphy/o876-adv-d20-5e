const TreeSync = require('../libs/tree-sync')
const path = require('path')

function buildData () {
    return TreeSync.recursiveRequire(path.resolve(__dirname, './data'))
}

module.exports = buildData()
