const EffectProcessor = require("../../../EffectProcessor");
const CONSTS = require("../../../consts");

/**
 * Ceci est l'effet de pourrissement de momie de certaines créatures undead, genre les momies et seigneur momies.
 * Il empêche les soins de fonctionner.
 * L'effet ne disparait que si la cible de l'effet se repose ou si elle se soigne avec des sorts genre restauration
 *
 * @param target {Creature}
 * @param source {Creature}
 * @param dc {number}
 */
module.exports = function ({ target, source, property: { data: { dc } } }) {
    const st = target.rollSavingThrow(CONSTS.ABILITY_CONSTITUTION, [CONSTS.THREAT_TYPE_DISEASE], dc, source)
    if (st.success) {
        return
    }
    if (target.store.getters.getEffects.find(eff =>
        eff.type === CONSTS.EFFECT_MUMMY_ROT &&
        eff.subtype === CONSTS.EFFECT_SUBTYPE_CURSE &&
        eff.duration === Infinity)) {
        return
    }
    const oCurse = EffectProcessor.createEffect(CONSTS.EFFECT_MUMMY_ROT)
    oCurse.subtype = CONSTS.EFFECT_SUBTYPE_CURSE
    target.applyEffect(oCurse, Infinity, source)
}