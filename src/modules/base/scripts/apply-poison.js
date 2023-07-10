const EffectProcessor = require("../../../EffectProcessor");
const CONSTS = require("../../../consts");

/**
 *
 * @param target {Creature}
 * @param source {Creature}
 * @param amp {number}
 * @param dot {number|string} dice
 * @param dc {number}
 * @param saveCount {number}
 * @param duration {number}
 */
module.exports = function ({ target, source, property: { amp, data: { dot, dc, saveCount, duration } } }) {
    const amount = source.roll(amp)
    target.applyEffect(
        EffectProcessor.createEffect(
            CONSTS.EFFECT_POISON,
            amount,
            dot,
            dc,
            saveCount
        ),
        duration,
        source
    )
}