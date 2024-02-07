const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect add a negative condition to the targeted creature
 * @param condition {string} CONDITION_*
 * @returns {D20Effect}
 */
function create (condition) {
    if (typeof condition !== 'string') {
        throw new TypeError('Effect condition type error')
    }
    return createEffect(CONSTS.EFFECT_CONDITION, 0, {
        condition
    })
}

module.exports = {
    create
}
