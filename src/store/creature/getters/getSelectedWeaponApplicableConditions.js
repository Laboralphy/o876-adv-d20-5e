const CONSTS = require("../../../consts");

/**
 * Renvoie la liste des propriétés ITEM_PROPERTY_ON_HIT_APPLY_CONDITION de l'équipement offensif
 * Ces propriétés offensives seront appliquées chaque fois que l'arme de la créature touche sa cible
 * Un jet de sauvegarde est autorisé
 * @param state {*}
 * @param getters
 * @returns {{condition: string, dc: number, saveAbility: number, duration: number}[]}
 */
module.exports = (state, getters) => {
    return getters
        .getSelectedWeaponProperties
        .filter(prop => prop.property === CONSTS.ITEM_PROPERTY_ON_HIT_APPLY_CONDITION)
        .map(prop => prop.data)
}