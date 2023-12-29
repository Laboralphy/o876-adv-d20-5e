const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect prevent maximum HP from being increased and/or decreased
 * @param value {number} if negative, hpmax cannot be lowered, if positive, hpmax cannot be raised
 * @returns {D20Effect}
 */
function create (value) {
    return createEffect(CONSTS.EFFECT_HP_BONUS_BLOCKER, value, {})
}

module.exports = {
    create
}