const CONSTS = require('../../../consts')
const { aggregateModifiers } = require('../common/aggregate-modifiers')

/**
 * Classe d'armure complete de la créature
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => {
    const { armor, dexterity, shield, effects, props } = getters.getArmorClassDetails
    return armor + dexterity + shield + effects + props
}
