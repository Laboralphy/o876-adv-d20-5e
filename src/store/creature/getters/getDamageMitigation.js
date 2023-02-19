const { aggregateModifiers } = require('../common/aggregate-modifiers')
const CONSTS = require("../../../consts");

function addMitigationType (oMitig, sType) {
    if (!(sType in oMitig)) {
        oMitig[sType] = {
            reduction: 0,
            resistance: false,
            vulnerability: false,
            factor: 1
        }
    }
}

function addMitigation(oMitig, am) {
    Object
        .keys(am.sorter)
        .forEach(t => {
            addMitigationType(oMitig, t)
        })
}

/**
 * @typedef D20OneDamageMitigation {object}
 * @property reduction {number}
 * @property factor {number}
 * @property resistance {boolean}
 * @property vulnerability {boolean}
 *
 * @param state
 * @param getters
 * @returns {Object<string, D20OneDamageMitigation>}}
 */
module.exports = (state, getters) => {
    const fEffectSorter = eff => {
        return eff.data.type
    }
    const fPropSorter = prop => prop.type
    const oReduction = aggregateModifiers([
        CONSTS.EFFECT_DAMAGE_REDUCTION,
        CONSTS.ITEM_PROPERTY_DAMAGE_REDUCTION
    ], getters, {
        effectSorter: fEffectSorter,
        propSorter: fPropSorter
    })
    const oResistance = aggregateModifiers([
        CONSTS.EFFECT_DAMAGE_RESISTANCE,
        CONSTS.ITEM_PROPERTY_DAMAGE_RESISTANCE
    ], getters, {
        effectSorter: fEffectSorter,
        propSorter: fPropSorter
    })
    const oVulnerability = aggregateModifiers([
        CONSTS.EFFECT_DAMAGE_VULNERABILITY,
        CONSTS.ITEM_PROPERTY_DAMAGE_VULNERABILITY
    ], getters, {
        effectSorter: fEffectSorter,
        propSorter: fPropSorter
    })
    const oMitigation = {}
    addMitigation(oMitigation, oReduction)
    addMitigation(oMitigation, oResistance)
    addMitigation(oMitigation, oVulnerability)
    Object
        .entries(oReduction.sorter)
        .forEach(([sDamType, oReg]) => {
            oMitigation[sDamType].reduction += oReg.sum
        })
    Object
        .entries(oResistance.sorter)
        .forEach(([sDamType, oReg]) => {
            oMitigation[sDamType].resistance ||= oReg.count > 0
        })
    Object
        .entries(oVulnerability.sorter)
        .forEach(([sDamType, oReg]) => {
            oMitigation[sDamType].vulnerability ||= oReg.count > 0
        })
    Object
        .entries(oMitigation)
        .forEach(([sDamType, oReg]) => {
            const r = oReg.resistance ? 'r' : ''
            const v = oReg.vulnerability ? 'v' : ''
            switch (r + v) {
                case 'r': {
                    oReg.factor = 0.5
                    break
                }
                case 'v': {
                    oReg.factor = 2
                    break
                }
            }
        })
    return oMitigation
}
