const CONSTS = require('../../../consts')

/**
 * Niveau de fatigue
 * @param state {object}
 * @param getters {D20CreatureStoreGetters}
 * @returns {number}
 */
module.exports = (state, getters) => {
    return getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_EXHAUSTION).length
}
