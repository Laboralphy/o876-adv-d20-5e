const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Groups several effects
 * @param effects {D20Effect[]}
 * @param tag {string}
 * @returns {D20Effect}
 */
function create (effects, tag) {
    // GROUP_TYPE_MAGICAL : les effets de ce groupe peuvent être dissipés
    // GROUP_TYPE
    return createEffect(CONSTS.EFFECT_GROUP, 0, { effects, applied: false, appliedEffects: [] }, tag)
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
        effect.data.appliedEffects = effect
            .data
            .effects
            .map(eff => oEffectProcessor.applyEffect(eff, target, duration, source))
    } else {
        if (effect.data.appliedEffects.every(eff => eff.duration <= 0)) {
            target.store.mutations.dispellEffect({ effect })
        }
    }
}

function dispose ({ effect, target }, oEffectProcessor) {
    effect
        .data
        .appliedEffects
        .forEach(eff => {
            target.store.mutations.dispellEffect({ effect: eff })
        })
    oEffectProcessor.removeDeadEffects(target)
}

module.exports = {
    mutate,
    dispose,
    create
}