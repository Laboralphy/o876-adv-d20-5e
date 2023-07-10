const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * This effect modifies a weapon damage output
 * either by augmenting or reducing
 * @param type {string} type of damage
 * @returns {D20Effect}
 */
function create (type = '') {
    return createEffect(CONSTS.EFFECT_DAMAGE_RESISTANCE, 0, {
        type
    })
}

module.exports = {
    create
}