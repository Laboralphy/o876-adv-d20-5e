const { getItem } = require('../../../../../libs/array-mutations')
/**
 *
 * @param state
 * @param getters
 * @param externals
 * @returns {{ count: number, used: number }[]}
 */
module.exports = (state, getters, externals) => {
    const nLevel = getters.getSpellCasterLevel
    const data = externals
        .data['data-ddmagic-spell-count']
        .find(dx => dx.wizardLevel === nLevel)
    if (!data) {
        throw new Error('this wizard level is invalid : ' + nLevel)
    }
    return data
        .slotCountPerLevel
        .map((n, i) => ({
            count: n,
            used: getItem(state.data.spellbook.slots, i)
        }))
}
