const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Remove damage point previously taken
 * @param nValue {string}
 * @returns {D20Effect}
 */
function create (amount) {
    return createEffect(CONSTS.EFFECT_HEAL, amount)
}

/**
 * Effectuer un soin sur la creature spécifiée
 * @param effect
 * @param target
 */
function mutate ({ effect, target }) {
    target.store.mutations.heal(effect.amp)
}

module.exports = {
    create,
    mutate
}
