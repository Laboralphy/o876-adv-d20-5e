const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect modifies a weapon damage output
 * either by augmenting or reducing
 * @param sFormula {string} formula, ex: 2d6 or 3d6+1
 * @param type {number} type of damage
 * @returns {D20Effect}
 */
function create ({ damage, type}) {
    return createEffect(CONSTS.EFFECT_DAMAGE_BONUS, 0, {
        damage,
        type
    })
}

module.exports = {
    create
}