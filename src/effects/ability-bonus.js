const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect modifies an ability by adding/subtracting an fixed value
 * @param ability {string} ability to be modified
 * @param value {number}
 * @returns {D20Effect}
 */
function create ({ ability, value }) {
    return createEffect(CONSTS.EFFECT_ABILITY_BONUS, value, {
        ability
    })
}

module.exports = {
    create
}