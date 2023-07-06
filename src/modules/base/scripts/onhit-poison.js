const EffectProcessor = require("../../../EffectProcessor");
const CONSTS = require("../../../consts");

module.exports = function (context) {
    const { target, source, property } = context
    const { dot, dc, saveCount, duration } = property.data
    const damage = property.amp
    const amount = source.roll(damage)
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