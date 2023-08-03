const CONSTS = require('../../../consts')
const { aggregateModifiers } = require('../common/aggregate-modifiers')

/**
 * Classe d'armure complete de la créature
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => {
    const {
        [CONSTS.ARMOR_DEFLECTOR_ARMOR]: armor,
        [CONSTS.ARMOR_DEFLECTOR_DEXTERITY]: dexterity,
        [CONSTS.ARMOR_DEFLECTOR_SHIELD]: shield,
        [CONSTS.ARMOR_DEFLECTOR_EFFECTS]: effects,
        [CONSTS.ARMOR_DEFLECTOR_PROPERTIES]: props
    } = getters.getArmorClassDetails
    return armor + dexterity + shield + effects + props
}
