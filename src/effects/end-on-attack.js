const createEffect = require('./abstract')
const CONSTS = require('../consts')

function create (oEffectToBreak) {
    return createEffect(CONSTS.EFFECT_END_ON_ATTACK, 0, { effect: oEffectToBreak })
}

function attack ({ effect }) {
    effect.duration = 0
    effect.data.effect.duration = 0
}

function mutate ({ effect }) {
    if (effect.data.effect.duration <= 0) {
        effect.duration = 0
    }
}

module.exports = {
    create,
    attack,
    mutate
}
