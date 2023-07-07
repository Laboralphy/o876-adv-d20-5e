const EffectProcessor = require("../../../EffectProcessor");
const CONSTS = require("../../../consts");

/**
 * Application d'une condition lorsqu'une arme frappe sa cible.
 *
 * Détails :
 * Les armes peuvent avoir l' itemProprerty ITEM_PROPERTY_ON_HIT et cette itemProperty spécifie le script
 * lancé à chaque fois que l'arme frappe une cible et fait des dégâts.
 * Cela permet à un concepteur de module de créer n'importe quel effet à appliquer à chaque fois qu'une arme frappe
 * sa cible.
 *
 * @param context {D20OnHitContext}
 */
module.exports = function (context) {
    const { target, source, property } = context
    const { condition, dc, saveAbility, duration } = property.data
    if (!target.store.getters.getConditions.has(condition)) {
        const { success } = target.rollSavingThrow(saveAbility, [], dc)
        if (!success) {
            target.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, condition), duration, source)
        }
    }
}
