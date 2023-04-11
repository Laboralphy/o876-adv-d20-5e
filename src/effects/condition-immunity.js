const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect modifies a weapon damage output
 * either by augmenting or reducing
 * @param condition {string} type of damage
 * @returns {D20Effect}
 */
function create (condition = '') {
    return createEffect(CONSTS.EFFECT_CONDITION_IMMUNITY, 0, {
        condition
    })
}

module.exports = {
    create
}