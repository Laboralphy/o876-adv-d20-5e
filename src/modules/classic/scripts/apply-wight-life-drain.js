const EffectProcessor = require("../../../EffectProcessor");
const CONSTS = require("../../../consts");

/**
 * Ceci est l'effet de drain de vie de certaines créatures undead, genre wight.
 * Il réduit la constitution de manière permanente.
 * L'effet ne disparait que si la cible de l'effet se repose ou si elle se soigne avec des sorts genre restauration
 *
 * @param target {Creature}
 * @param source {Creature}
 * @param dc {number}
 * @param attackOutcome {AttackOutcome}
 */
module.exports = function ({ target, source, attackOutcome, property: { data: { dc } } }) {
    const st = target.rollSavingThrow(CONSTS.ABILITY_CONSTITUTION, [CONSTS.THREAT_TYPE_DEATH], dc, source)
    if (st.success) {
        return
    }
    const amount = attackOutcome.damages.amount
    if (amount > 0) {
        const oCurse = EffectProcessor.createEffect(
            CONSTS.EFFECT_HP_BONUS,
            -amount,
        )
        oCurse.subtype = CONSTS.EFFECT_SUBTYPE_CURSE
        target.applyEffect(oCurse, Infinity, source)
        target.store.mutations.heal({ amount })
    } else {
        console.log('no damage amount')
    }
}