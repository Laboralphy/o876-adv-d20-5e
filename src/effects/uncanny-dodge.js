const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effects mitigates damage from current target's weapon when this target is visible
 * This effect protects target against at most one attack per round
 * @returns {D20Effect}
 */
function create () {
    const oEffect = createEffect(CONSTS.EFFECT_UNCANNY_DODGE, 1)
    oEffect.unicity = CONSTS.EFFECT_UNICITY_NO_REPLACE
    return oEffect
}

function mutate ({ effect }) {
    if (effect.amp === 0) {
        effect.amp = 1
    }
}

module.exports = {
    create,
    mutate
}
