const {aggregateModifiers} = require('../common/aggregate-modifiers')
const CONSTS = require('../../../consts')

/**
 * Renvoie le nombre d'attaque par tour
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => {
    const nExtraAttacks = aggregateModifiers([
        CONSTS.ITEM_PROPERTY_EXTRA_ATTACKS,
        CONSTS.EFFECT_EXTRA_ATTACKS
    ], getters).sum
    return Math.max(1, 1 + nExtraAttacks)
}