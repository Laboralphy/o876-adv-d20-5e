const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect add bonus damage on critical
 * @param value {number}
 * @returns {D20Effect}
 */
function create (value) {
    return createEffect(CONSTS.EFFECT_MASSIVE_CRITICAL, value)
}

module.exports = {
    create
}