const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect modifies maximum hit points.
 * The value may be positive or negative
 * @param value {number}
 * @returns {D20Effect}
 */
function create (value) {
    return createEffect(CONSTS.EFFECT_HP_BONUS, value, { __applied: false })
}

module.exports = {
    create
}