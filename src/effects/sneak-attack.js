const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect do nothing
 * @returns {D20Effect}
 */
function create (value) {
    return createEffect(CONSTS.EFFECT_SNEAK_ATTACK, value)
}

function mutate ({ effect, target, source }, oEffectProcessor) {
    target._hasUsedSneakAttack = false
}

module.exports = {
    create,
    mutate
}
