const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect modifies an ability by adding/subtracting an fixed value
 * @param value {number}
 * @returns {D20Effect}
 */
function create (value) {
    return createEffect(CONSTS.EFFECT_ATTACK_BONUS, value)
}

module.exports = {
    create
}