const CONSTS = require('../../../consts')
/**
 *
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const target = getters.getTarget
    if (target) {
        return !target.conditions[CONSTS.CONDITION_INVISIBLE]
    } else {
        return true
    }
}
