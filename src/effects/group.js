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
    return createEffect(CONSTS.EFFECT_GROUP, 0, { effects, applied: false }, tag)
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
        effect
            .data
            .effects
            .forEach(eff => {
                oEffectProcessor.applyEffect(eff, target, duration, source)
            })
    }
}

function dispose ({ target }, oEffectProcessor) {
    target
        .store
        .getters
        .getEffects
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