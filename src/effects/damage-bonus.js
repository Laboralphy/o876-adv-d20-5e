const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect modifies a weapon damage output
 * either by augmenting or reducing
 * @param damage {number} formula, ex: 2d6 or 3d6+1
 * @param type {string} type of damage
 * @returns {D20Effect}
 */
function create (damage, type = '') {
    return createEffect(CONSTS.EFFECT_DAMAGE_BONUS, damage, {
        type
    })
}

module.exports = {
    create
}