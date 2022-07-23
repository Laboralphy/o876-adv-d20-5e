const createEffect = require('./abstract')
/**
 * This effect modifies an ability by adding/subtracting an fixed value
 * @param ability {string} ability to be modified
 * @param value {number}
 * @returns {D20Effect}
 */
function create ({ ability, value }) {
    return createEffect('ability-bonus', value, {
        ability
    })
}

module.exports = {
    create
}