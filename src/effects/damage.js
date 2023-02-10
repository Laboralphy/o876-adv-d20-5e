const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Inflict damage
 * @param amount {number}
 * @param type {number} DAMAGE_TYPE_
 * @returns {D20Effect}
 */
function create (amount, type) {
    return createEffect(CONSTS.EFFECT_DAMAGE, amount, { type })
}

/**
 * Apply effect modification on effect target
 * @param effect {D20Effect}
 * @param target {Creature}
 */
function mutate ({ effect, target }) {
    // Removing armor and TGH
    target.store.mutations.applyDamage({
        amount: effect.amp,
        type: effect.data.type
    })
}

module.exports = {
    create,
    mutate
}