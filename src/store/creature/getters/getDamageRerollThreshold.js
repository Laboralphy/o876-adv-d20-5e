const { aggregateModifiers } = require('../common/aggregate-modifiers')
const CONSTS = require("../../../consts");

function filterRollTypeDamage (x) {
    return x.data.when === CONSTS.ROLL_TYPE_DAMAGE
}

/**
 * Liste des effets actifs sur la créature
 * @param state
 * @returns {[]}
 */
module.exports = (state, getters) => aggregateModifiers(
    [CONSTS.EFFECT_REROLL, CONSTS.ITEM_PROPERTY_REROLL],
    getters,
    {
        effectFilter: filterRollTypeDamage,
        propFilter: filterRollTypeDamage
    }
).max

