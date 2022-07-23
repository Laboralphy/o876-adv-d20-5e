const createEffect = require('./abstract')
/**
 * This effect add a negative condition to the targeted creature
 * @param condition {string} CONDITION_*
 * @returns {D20Effect}
 */
function create ({ condition }) {
    return createEffect('condition', 1, {
        condition
    })
}

module.exports = {
    create
}
