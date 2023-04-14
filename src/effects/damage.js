const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Inflict damage
 * @param amount {number}
 * @param type {string} DAMAGE_TYPE_
 * @param material {string} MATERIAL_
 * @returns {D20Effect}
 */
function create (amount, type, material = CONSTS.MATERIAL_UNKNOWN) {
    return createEffect(CONSTS.EFFECT_DAMAGE, amount, {
        type,
        material,
        appliedAmount: 0
    })
}

/**
 * Apply effect modification on effect target
 * @param effect {D20Effect}
 * @param target {Creature}
 */
function mutate ({ effect, target }) {
    // What is the damage resistance, vulnerability, reduction ?
    const oMitigation = target.store.getters.getDamageMitigation
    const sType = effect.data.type
    let amp = effect.amp
    if (sType in oMitigation) {
        const { resistance, vulnerability, factor, reduction } = oMitigation[sType]
        amp = Math.floor(Math.max(0, (amp - reduction)) * factor)
    }
    target.store.mutations.damage({ amount: amp })
}

module.exports = {
    create,
    mutate
}