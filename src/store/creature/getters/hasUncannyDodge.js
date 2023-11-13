const CONSTS = require('../../../consts')

/**
 * Renvoie true si la creature a uncanny dodge
 * @param state
 * @param getters
 * @return {boolean}
 */
module.exports = (state, getters) => {
    return !!getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_UNCANNY_DODGE)
}