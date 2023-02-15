const { aggregateModifiers } = require('../common/aggregate-modifiers')
const CONSTS = require("../../../consts");

module.exports = (state, getters) => {
    const fEffectSorter = eff => eff.data.type
    const fPropSorter = prop => prop.type
    const target = getters.getTarget
    const oReduction = target.aggregateModifiers([
        CONSTS.EFFECT_DAMAGE_REDUCTION,
        CONSTS.ITEM_PROPERTY_ATTACK_REDUCTION
    ], {
        effectSorter: fEffectSorter,
        propSorter: fPropSorter
    })
    const oResistance = target.aggregateModifiers([
        CONSTS.EFFECT_DAMAGE_RESISTANCE,
        CONSTS.ITEM_PROPERTY_DAMAGE_RESISTANCE
    ], {
        effectSorter: fEffectSorter,
        propSorter: fPropSorter
    })
    const oVulnerability = target.aggregateModifiers([
        CONSTS.EFFECT_DAMAGE_VULNERABILITY,
        CONSTS.ITEM_PROPERTY_DAMAGE_VULNERABILITY
    ], {
        effectSorter: fEffectSorter,
        propSorter: fPropSorter
    })
}