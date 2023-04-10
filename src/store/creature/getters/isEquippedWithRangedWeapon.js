const CONSTS = require("../../../consts");

/**
 * Renvoie true si la creature est equipée d'une arme à distance (mais pas nécessairement sélectionnée)
 * @return {boolean}
 */
module.exports = (state, getters) => getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED] !== null