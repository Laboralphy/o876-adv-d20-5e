const CONFIG = require('../../../config')

module.exports = state => {
    return state
        .effects
        .filter(eff =>
            eff.tag === CONFIG.EFFECT_CONDITION &&
            eff.data.condition === CONFIG.CONDITION_EXHAUSTION
        )
        .length
}
