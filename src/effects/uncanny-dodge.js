const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effects mitigates damage from current target's weapon when this target is visible
 * @returns {D20Effect}
 */
function create () {
    return createEffect(CONSTS.EFFECT_UNCANNY_DODGE, 0)
}

module.exports = {
    create
}
