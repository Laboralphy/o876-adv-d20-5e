const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Inflict damage
 * @param amount {number}
 * @param type {number} DAMAGE_TYPE_
 * @returns {D20Effect}
 */
function create (amount, type) {
    return createEffect(CONSTS.EFFECT_DAMAGE, amount, {
        type,
        resistedAmount: 0
    })
}

/**
 * Apply effect modification on effect target
 * @param effect {D20Effect}
 * @param target {Creature}
 */
function mutate ({ effect, target }) {
    // What is the damage resistance, vulnerability, reduction ?
    target.store.mutations.damage(effect.amp)
}

module.exports = {
    create,
    mutate
}