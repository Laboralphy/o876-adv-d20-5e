const EffectProcessor = require('../../../EffectProcessor')
const CONSTS = require('../../../consts')

/**
 * Récupération de (1d10 + level) point de vie
 * @param caster
 */
module.exports = function (caster) {
    const nLevel = caster.store.getters.getLevelByClass['fighter']
    const nHeal = caster.roll('1d10')
    const eHeal = EffectProcessor.createEffect(CONSTS.EFFECT_HEAL, nHeal + nLevel)
    caster.applyEffect(eHeal, 0)
}
