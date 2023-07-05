const CONSTS = require('../../../consts')
/**
 * Vitesse de la créature
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {number}
 */
module.exports = (state, getters) => {
    const cond = getters.getConditions
    let nSpeed = state.speed
    const nExhaustionLevel = getters.getExhaustionLevel
    let nSpeedFactor = nExhaustionLevel >= 5
        ? 0
        : nExhaustionLevel >= 2
            ? 0.5
            : 1
    if (cond.has(CONSTS.CONDITION_RESTRAINED) || cond.has(CONSTS.CONDITION_INCAPACITATED) || cond.has(CONSTS.CONDITION_GRAPPLED)) {
        nSpeedFactor = 0
    }
    return Math.floor(nSpeed * nSpeedFactor)
}
