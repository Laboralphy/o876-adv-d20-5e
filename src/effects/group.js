const createEffect = require('./abstract')
const CONSTS = require('../consts')

/**
 * Groups several effects
 * @param label {string}
 * @param effects {D20Effect[]}
 * @returns {D20Effect}
 */
function create ({ label = '', effects = [] }) {
    return createEffect(CONSTS.EFFECT_GROUP, 1, { label, effects, applied: false })
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
            eff.duration = 0
        })
    oEffectProcessor.removeDeadEffects(target)
}

module.exports = {
    mutate,
    dispose,
    create
}