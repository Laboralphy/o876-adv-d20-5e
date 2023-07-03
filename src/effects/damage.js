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
        material: Array.isArray(material) ? material : [material],
        originalAmount: amount,
        appliedAmount: 0,
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
    const oMitigation = target.store.getters.getDamageMitigation
    const sType = effect.data.type
    const aMaterials = effect.data.material
    let bMaterialVulnerable = false
    if (aMaterials) {
        bMaterialVulnerable = aMaterials.some(m => oMitigation[m] && oMitigation[m].vulnerability)
    }
    let amp = effect.amp
    if (sType in oMitigation) {
        const { resistance, vulnerability, factor, reduction } = oMitigation[sType]
        const appliedAmount = Math.ceil(Math.max(0, (amp - reduction)) * factor * (bMaterialVulnerable ? 2 : 1))
        effect.data.resistedAmount = amp - appliedAmount
        effect.amp = amp = effect.data.appliedAmount = appliedAmount
    }
    target.store.mutations.addRecentDamageType({ amount: effect.amp, type: sType })
    target.store.mutations.damage({ amount: effect.amp })
}

module.exports = {
    create,
    mutate
}