const EffectProcessor = require('../../../EffectProcessor')
const CONSTS = require('../../../consts')

module.exports = function (creature) {
    const nLevel = creature.store.getters.getLevelByClass['fighter']
    const nHeal = creature.roll('1d10')
    const eHeal = EffectProcessor.createEffect(CONSTS.EFFECT_HEAL, nHeal + nLevel)
    creature.applyEffect(eHeal, 0)
}
