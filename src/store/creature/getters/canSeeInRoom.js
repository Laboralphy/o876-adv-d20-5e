const CONSTS = require('../../../consts')

/**
 * Renvoie true si la creature peut voir dans la pièce, que celle-ci soit éclairée ou sombre
 * @param state
 * @param getters
 * @returns {boolean}
 */
module.exports = (state, getters) => {
    const bHasDarkVision =
        getters.getEffectSet.has(CONSTS.EFFECT_DARKVISION) ||
        getters.getEquipmentItemPropertySet.has(CONSTS.ITEM_PROPERTY_DARKVISION)
    const bInDarkRoom = getters.getAreaFlagSet.has(CONSTS.AREA_FLAG_DARK)
    return !bInDarkRoom || (bInDarkRoom && bHasDarkVision)
}
