const CONSTS = require('../../../consts')

/**
 * Liste des propriété des équippement défensif (armure, bouclier etc...)
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {[]}
 */
module.exports = (state, getters) =>
    getters
        .getEquipmentList
        .map(item => item.properties)
        .flat()

