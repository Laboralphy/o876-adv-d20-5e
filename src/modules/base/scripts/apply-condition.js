const EffectProcessor = require("../../../EffectProcessor");
const CONSTS = require("../../../consts");

/**
 * Application d'une condition lorsqu'une arme frappe sa cible.
 * Détails :
 * Les armes peuvent avoir l' item-property ITEM_PROPERTY_ON_HIT et cette itemProperty spécifie le script
 * lancé à chaque fois que l'arme frappe une cible et fait des dégâts.
 * Cela permet à un concepteur de module de créer n'importe quel effet à appliquer à chaque fois qu'une arme frappe
 * sa cible.
 *
 * @param target {Creature}
 * @param source {Creature}
 * @param condition {string} condition
 * @param dc {number}
 * @param saveAbility {string} ability
 * @param duration {number}
 */
module.exports = function ({ target, source, property: { condition, dc, saveAbility, duration } }) {
    if (!target.store.getters.getConditions.has(condition)) {
        const st = target.rollSavingThrow(saveAbility, [], dc)
        if (!st.success) {
            target.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, condition), duration, source)
        }
    }
}
