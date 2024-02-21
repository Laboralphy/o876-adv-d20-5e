const CONSTS = require('../../../consts')

/**
 *
 * @param state
 * @param getters
 * @returns {Set<string>}
 */
module.exports = state => {
    const oStealthEffect = state.effects.find(effect => effect.type === CONSTS.EFFECT_STEALTH)
    if (oStealthEffect) {
        return new Set(oStealthEffect.data.detectedBy)
    } else {
        return new Set()
    }
}