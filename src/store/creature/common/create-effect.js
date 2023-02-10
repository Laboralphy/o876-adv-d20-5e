const EffectProcessor = require('../../../EffectProcessor')
const CONSTS = require('../../../consts')

function createFeatEffect (sFeat, idSource, sEffect, ...args) {
    const eff = EffectProcessor.createEffect(sEffect, ...args)
    eff.subtype = CONSTS.EFFECT_SUBTYPE_FEAT
    eff.tag = sFeat
    eff.duration = Infinity
    eff.source = idSource
    return eff
}

module.exports = {
    createFeatEffect
}