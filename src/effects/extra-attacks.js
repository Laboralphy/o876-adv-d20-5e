const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect modifies attack count per turn
 * The value may be positive or negative
 * @param value {number}
 * @returns {D20Effect}
 */
function create (value) {
    return createEffect(CONSTS.EFFECT_EXTRA_ATTACKS, value, { __applied: false })
}

module.exports = {
    create
}