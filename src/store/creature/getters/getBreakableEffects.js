const CONSTS = require('../../../consts')

/**
 *
 * @param state {object}
 * @param getters {D20CreatureStoreGetters}
 * @returns {D20Effect[]}
 */
module.exports = (state, getters) => getters.getEffects.filter(eff => eff.subtype === CONSTS.EFFECT_SUBTYPE_BREAKABLE)
