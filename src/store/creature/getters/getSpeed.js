const CONSTS = require('../../../consts')
const {aggregateModifiers} = require("../common/aggregate-modifiers");
/**
 * Vitesse de la créature lors d'une charge ou d'une fuite
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
    const nSpeedBonus = aggregateModifiers([
        CONSTS.ITEM_PROPERTY_SPEED_BONUS,
        CONSTS.EFFECT_SPEED_BONUS
    ], getters).sum
    return Math.floor(Math.max(0, nSpeed * nSpeedFactor + nSpeedBonus))
}
