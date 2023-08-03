const CONSTS = require('../../../consts')
const { aggregateModifiers } = require('../common/aggregate-modifiers')

/**
 * Classe d'armure complete de la créature
 * @param state
 * @param getters
 * @returns {{type: string, min: number, max: number}[]}
 */
module.exports = (state, getters) => {
    const oDetails = getters.getArmorClassDetails
    const aRanges = [{
        type: 'miss',
        min: -Infinity,
        max: 10,
        value: 0
    }]
    const aOrder = [
        'dexterity',
        'shield',
        'effects',
        'props',
        'armor'
    ]
    let n = 11
    aOrder.forEach(o => {
        const value = oDetails[o]
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
