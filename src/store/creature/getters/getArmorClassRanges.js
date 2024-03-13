const CONSTS = require('../../../consts')

/**
 * Classe d'armure complete de la créature
 * @param state
 * @param getters
 * @returns {{type: string, min: number, max: number}[]}
 */
module.exports = (state, getters) => {
    const oDetails = getters.getArmorClassDetails
    const aRanges = [{
        type: CONSTS.ARMOR_DEFLECTOR_MISS,
        min: -Infinity,
        max: 10,
        value: 0
    }]
    const aOrder = [
        CONSTS.ARMOR_DEFLECTOR_DEXTERITY,
        CONSTS.ARMOR_DEFLECTOR_SHIELD,
        CONSTS.ARMOR_DEFLECTOR_EFFECTS,
        CONSTS.ARMOR_DEFLECTOR_PROPERTIES,
        CONSTS.ARMOR_DEFLECTOR_ARMOR
    ]
    let n = 11
    aOrder.forEach(o => {
        const value = o === CONSTS.ARMOR_DEFLECTOR_ARMOR
            ? oDetails[o] - 10
            : oDetails[o]
        if (value > 0) {
            aRanges.push({
                type: o,
                min: n,
                max: n + value - 1,
                value: value
            })
            n += value
        }
    })
    return aRanges
}
