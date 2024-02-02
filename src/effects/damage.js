const createEffect = require('./abstract')
const CONSTS = require('../consts')
const { EFFECT_UNCANNY_DODGE, EFFECT_SUBTYPE_WEAPON } = CONSTS

/**
 * Inflict damage
 * @param amount {number}
 * @param type {string} DAMAGE_TYPE_
 * @param material {string} MATERIAL_
 * @param critical {boolean}
 * @returns {D20Effect}
 */
function create (amount, type, material = CONSTS.MATERIAL_UNKNOWN, critical = false) {
    return createEffect(CONSTS.EFFECT_DAMAGE, amount, {
        type,
        material: Array.isArray(material) ? material : [material],
        originalAmount: amount,
        appliedAmount: 0,
        resistedAmount: 0,
        critical
    })
}

/**
 * Apply effect modification on effect target
 * @param effect {D20Effect}
 * @param target {Creature}
 * @param source {Creature}
 */
function mutate ({ effect, target, source }) {
    // What is the damage resistance, vulnerability, reduction ?
    const oMitigation = target.store.getters.getDamageMitigation
    const sType = effect.data.type
    const aMaterials = effect.data.material
    const bSubTypeWeapon = effect.subtype === EFFECT_SUBTYPE_WEAPON
    let bMaterialVulnerable = false
    if (aMaterials) {
        bMaterialVulnerable = aMaterials.some(m => oMitigation[m] && oMitigation[m].vulnerability)
    }
    let amp = effect.amp
    if (sType in oMitigation) {
        const { resistance, vulnerability, factor, reduction, immunity } = oMitigation[sType]
        const nFinalFactor = bMaterialVulnerable ? Math.min(1, 2 * factor) : factor
        const appliedAmount = Math.ceil(Math.max(0, (amp - reduction)) * nFinalFactor)
        effect.data.resistedAmount += amp - appliedAmount
        effect.amp = amp - effect.data.resistedAmount
        effect.data.appliedAmount = appliedAmount
    } else {
        // no resistance no absorb no immunity
        effect.data.appliedAmount = amp
    }
    if (target.store.getters.getEffectSet.has(EFFECT_UNCANNY_DODGE)) {
        const eUncannyDodge = target.store.getters.getEffects.find(eff => eff.type === EFFECT_UNCANNY_DODGE && eff.amp > 0)
        if (bSubTypeWeapon && !!eUncannyDodge && source === target.getTarget()) {
            const appliedAmount = Math.ceil(effect.data.appliedAmount / 2)
            const resistedAmount = effect.data.appliedAmount - appliedAmount
            effect.data.resistedAmount += resistedAmount
            effect.amp = appliedAmount
            eUncannyDodge.amp = 0
        }
    }
    target.store.mutations.addRecentDamageType({ amount: effect.amp, type: sType })
    target.store.mutations.damage({ amount: effect.amp })
}

module.exports = {
    create,
    mutate
}