const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effects mitigates damage from reflex savable threat like evocation spell, or traps
 * @returns {D20Effect}
 */
function create () {
    const oEffect = createEffect(CONSTS.EFFECT_EVASION)
    oEffect.unicity = CONSTS.EFFECT_UNICITY_NO_REPLACE
    return oEffect
}

module.exports = {
    create
}
