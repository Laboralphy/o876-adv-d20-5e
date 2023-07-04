const CONSTS = require("../../../consts");

/**
 * Renvoie la liste des propriétés ITEM_PROPERTY_ON_HIT_APPLY_CONDITION
 * @param state {*}
 * @param getters
 * @returns {{condition: string, dc: number, ability: number, duration: number}[]}
 */
module.exports = (state, getters) => {
    return getters
        .getSelectedWeaponProperties
        .filter(prop => prop.property === CONSTS.ITEM_PROPERTY_ON_HIT_APPLY_CONDITION)
        .map(prop => prop.data)
}