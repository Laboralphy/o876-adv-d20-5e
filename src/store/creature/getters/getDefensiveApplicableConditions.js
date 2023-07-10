const CONSTS = require("../../../consts");

/**
 * Renvoie la liste des propriétés ITEM_PROPERTY_ON_HIT_APPLY_CONDITION de l'équipement défensif
 * Ces propriétés offensives seront appliquées chaque fois qu'un aggresseur touche la créature
 * Un jet de sauvegarde est autorisé
 * @param state {*}
 * @param getters
 * @returns {{condition: string, dc: number, ability: number, duration: number}[]}
 */
module.exports = (state, getters) => {
    return getters
        .getDefensiveEquipmentList
        .map(item => item.properties)
        .filter(prop => prop.property === CONSTS.ITEM_PROPERTY_ON_HIT_APPLY_CONDITION)
        .map(prop => prop.data)
}
