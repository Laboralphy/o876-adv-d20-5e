const path = require('path')
const TreeSync = require('../../libs/tree-sync')
require('./getters-jsdoc')
require('./mutations-jsdoc')

/**
 * @typedef D20CreatureStore {object}
 * @property mutations {D20CreatureStoreMutations}
 * @property getters {D20CreatureStoreGetters}
 */

const buildState = require('./state')
/**
 * @type {D20CreatureStoreMutations}
 */
const mutations = TreeSync.recursiveRequire(path.resolve(__dirname, 'mutations'), true)
/**
 * @type {D20CreatureStoreGetters}
 */
const getters = TreeSync.recursiveRequire(path.resolve(__dirname, 'getters'), true)

module.exports = {
    buildState,
    mutations,
    getters
}