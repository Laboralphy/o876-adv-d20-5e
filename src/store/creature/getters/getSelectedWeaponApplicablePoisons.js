const CONSTS = require("../../../consts");

/**
 * Renvoie la liste des propriétés ITEM_PROPERTY_ON_HIT_POISON de l'équipement offensif
 * Un effet poison est appliqué pour chaque propriété sur l'arme
 * @param state {*}
 * @param getters
 * @returns {{condition: string, dc: number, saveAbility: number, duration: number}[]}
 */
module.exports = (state, getters) => {
    return getters
        .getSelectedWeaponProperties
        .filter(prop => prop.property === CONSTS.ITEM_PROPERTY_ON_HIT_POISON)
        .map(prop => ({ damage: prop.amp, ...prop.data}))
}