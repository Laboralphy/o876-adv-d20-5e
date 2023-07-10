const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Remove damage point previously taken
 * @param amount {number}
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
    const { factor } = target.store.getters.getHealMitigation
    target.store.mutations.heal({ amount: Math.floor(effect.amp * factor) })
}

module.exports = {
    create,
    mutate
}
