const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Remove damage point previously taken
 * @param amount {number}
 * @param useConstitutionModifier {boolean} si true, alors le modificateur de constitution améliore le soin
 * @returns {D20Effect}
 */
function create (amount, { useConstitutionModifier = false } = {}) {
    return createEffect(CONSTS.EFFECT_HEAL, amount, { useConstitutionModifier })
}

/**
 * Effectuer un soin sur la creature spécifiée
 * @param effect
 * @param target
 */
function mutate ({ effect, target }) {
    const { factor } = target.store.getters.getHealMitigation
    let nBonus = 0
    if (effect.data.useConstitutionModifier) {
        nBonus += target.store.getters.getAbilityModifiers[CONSTS.ABILITY_CONSTITUTION]
    }
    target.store.mutations.heal({ amount: Math.floor(effect.amp * factor) + nBonus })
}

module.exports = {
    create,
    mutate
}
