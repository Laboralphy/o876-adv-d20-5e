const CONSTS = require("../../../consts");

/**
 * Renvoie la liste des armes équipées, ainsi que les munitions
 * @return {{ ranged: D20Item, melee: D20Item, natural: D20Item, ammo: D20Item }}
 */
module.exports = (state, getters) => ({
    ranged: getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED],
    melee: getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE],
    natural: getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON],
    ammo: getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_AMMO]
})