const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect add an advantage
 * @returns {D20Effect}
 */
function create ({ rollTypes, abilities, tag }) {
    return createEffect(CONSTS.EFFECT_DISADVANTAGE, 1, {
        rollTypes,
        abilities,
        tag
    })
}

module.exports = {
    create
}
