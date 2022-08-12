const CONSTS = require('../../../consts')

/**
 * Renvoie true si l'armure génère un désavantage de furtivité.
 * @param state
 * @param getters
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const oArmor = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_CHEST]
    return oArmor
        ? oArmor.disadvantageStealth
        : false
}
