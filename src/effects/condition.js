const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect add a negative condition to the targeted creature
 * @param condition {string} CONDITION_*
 * @returns {D20Effect}
 */
function create (condition) {
    return createEffect(CONSTS.EFFECT_CONDITION, 0, {
        condition
    })
}

module.exports = {
    create
}
