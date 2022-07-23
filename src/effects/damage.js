const createEffect = require('./abstract')

/**
 * Inflict damage
 * @param nValue
 * @param type {number} DAMAGE_TYPE_
 * @returns {D20Effect}
 */
function create ({ amount, type }) {
    return createEffect('damage', amount, { type })
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