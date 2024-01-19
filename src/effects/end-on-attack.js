const createEffect = require('./abstract')
const CONSTS = require('../consts')

function create (oEffectToBreak) {
    oEffectToBreak.exportable = false
    const oEffect = createEffect(CONSTS.EFFECT_END_ON_ATTACK, 0, { effect: oEffectToBreak })
    oEffect.exportable = false
    return oEffect
}

function attack ({ effect, target }) {
    const oEffectToBreak = getEffectToBreak(effect, target)
    if (oEffectToBreak) {
        target.store.mutations.dispelEffect(oEffectToBreak)
    }
    target.store.mutations.dispelEffect(effect)
}

function getEffectToBreak (effect) {
    return effect.data.effect
}

module.exports = {
    create,
    attack
}