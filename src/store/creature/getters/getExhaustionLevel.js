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
            eff.type === CONSTS.EFFECT_EXHAUSTION
        )
        .length
}
