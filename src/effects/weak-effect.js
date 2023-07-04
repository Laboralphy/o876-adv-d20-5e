/**
 * Cet effet transforme un effet durable en effet fragile, en laçant un jet de sauvegarde chaque tour.
 */
const createEffect = require("./abstract");
const CONSTS = require("../consts");

function create (effect, ability, dc) {
    return createEffect(CONSTS.EFFECT_WEAK_EFFECT, 0, { effect, dc, ability, applied: false, appliedEffect: null })
}

/**
 * Lancer les mutate de tous les effets
 * @param effect
 * @param target
 * @param source
 * @param oEffectProcessor {EffectProcessor}
 */
function mutate ({ effect, target, source }, oEffectProcessor) {
    if (!effect.data.applied) {
        effect.data.applied = true
        const duration = effect.duration
        effect.data.appliedEffect = oEffectProcessor.applyEffect(effect.data.effect, target, duration, source)
    } else {
        const { dc, ability } = effect.data
        const { success } = target.rollSavingThrow(ability, [], dc)
        if (success) {
            target.store.mutations.dispellEffect({ effect })
        }
    }
}

function dispose ({ effect, target }, oEffectProcessor) {
    target.store.mutations.dispellEffect({ effect: effect.data.appliedEffect })
    oEffectProcessor.removeDeadEffects(target)
}

module.exports = {
    create,
    dispose,
    mutate
}


