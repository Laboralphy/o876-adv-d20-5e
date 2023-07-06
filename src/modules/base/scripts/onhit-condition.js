const EffectProcessor = require("../../../EffectProcessor");
const CONSTS = require("../../../consts");

module.exports = function (context) {
    const { target, source, property } = context
    if (!context.conditions) {
        context.conditions = new Set(target.store.getters.getConditions)
    }
    const { condition, dc, saveAbility, duration } = property.data
    if (!context.conditions.has(condition)) {
        const { success } = target.rollSavingThrow(saveAbility, [], dc)
        if (!success) {
            target.applyEffect(EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, condition), duration, source)
        }
    }
}