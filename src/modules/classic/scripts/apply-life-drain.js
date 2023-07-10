const EffectProcessor = require("../../../EffectProcessor");
const CONSTS = require("../../../consts");

/**
 * Ceci est l'effet de drain de vie de certaines créatures undead, genre wight.
 * Il réduit la constitution de manière permanente.
 * L'effet ne disparait que si la cible de l'effet se repose ou si elle se soigne avec des sorts genre restauration
 *
 * @param target {Creature}
 * @param source {Creature}
 * @param amp {number|string} dice
 * @param dc {number}
 */
module.exports = function ({ target, source, property: { amp, data: { dc } } }) {
    const st = target.rollSavingThrow(CONSTS.ABILITY_CONSTITUTION, [CONSTS.THREAT_TYPE_DEATH], dc)
    if (st.success) {
        return
    }
    const amount = source.roll(amp)
    const oCurse = EffectProcessor.createEffect(
        CONSTS.EFFECT_ABILITY_BONUS,
        -amount,
    )
    oCurse.subtype = CONSTS.EFFECT_SUBTYPE_CURSE
    target.applyEffect(oCurse, Infinity, source)
}