const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effects mitigates damage from reflex savable threat like evocation spell, or traps
 * @returns {D20Effect}
 */
function create () {
    return createEffect(CONSTS.EFFECT_EVASION, 0)
}

module.exports = {
    create
}
