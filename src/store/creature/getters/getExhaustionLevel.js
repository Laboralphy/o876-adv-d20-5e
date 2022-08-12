const CONFIG = require('../../../config')
const CONSTS = require('../../../consts')

/**
 * Niveau de fatigue
 * @param state {object}
 * @returns {number}
 */
module.exports = state => {
    return state
        .effects
        .filter(eff =>
            eff.tag === CONSTS.EFFECT_CONDITION &&
            eff.data.condition === CONSTS.CONDITION_EXHAUSTI
        )
        .length
}
