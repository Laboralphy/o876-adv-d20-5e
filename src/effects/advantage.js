const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect add an advantage
 * @returns {D20Effect}
 */
function create ({ rollTypes, abilities, label }) {
    return createEffect(CONSTS.EFFECT_ADVANTAGE, 1, {
        rollTypes,
        abilities,
        label
    })
}

module.exports = {
    create
}
