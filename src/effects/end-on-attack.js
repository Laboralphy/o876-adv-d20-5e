const createEffect = require('./abstract')
const CONSTS = require('../consts')

function create (oEffectToBreak) {
    return createEffect(CONSTS.EFFECT_END_ON_ATTACK, 0, { effect: oEffectToBreak.id })
}

function attack ({ effect, target }) {
    effect.duration = 0
    const oEffectToBreak = getEffectToBreak(effect, target)
    if (oEffectToBreak) {
        oEffectToBreak.duration = 0
    }
}

function getEffectToBreak (effect, target) {
    const idEffectToBreak = effect.data.effect
    return target.store.getEffects.find(eff => eff.id === idEffectToBreak)
}

module.exports = {
    create,
    attack
}