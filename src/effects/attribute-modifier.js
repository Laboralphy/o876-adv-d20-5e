const createEffect = require('./abstract')
/**
 * This effect modifies an attribute by adding/subtracting an fixed value
 * @param attribute {string} attribute to be modified
 * @param value {number}
 * @returns {D20Effect}
 */
function create ({ attribute, value }) {
    return createEffect('attribute-modifier', value, {
        attribute
    })
}

module.exports = {
    create
}