const CONSTS = require('../../../consts')

/**
 * Registre des altérations d'états
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {Set<string>}
 */
module.exports = (state, getters) => {
    return new Set(Object
        .entries(getters.getConditionSources)
        .filter(([key, value]) => value.size > 0)
        .map(([key, value]) => key)
    )
}
