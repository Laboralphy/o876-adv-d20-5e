const CONSTS = require('../../../../../consts')

/**
 * Renvoie true si la creature est equipée d'une armure légère, moyenne ou lourde
 * @param state
 * @param getters
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const oArmor = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_CHEST]
    const ap = oArmor ? oArmor.proficiency : ''
    return ap === CONSTS.PROFICIENCY_ARMOR_LIGHT || ap === CONSTS.PROFICIENCY_ARMOR_MEDIUM || ap === CONSTS.PROFICIENCY_ARMOR_HEAVY
}
