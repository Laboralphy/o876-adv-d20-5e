const CONSTS = require('../../../consts')

const aSlots = [
    CONSTS.EQUIPMENT_SLOT_HEAD,
    CONSTS.EQUIPMENT_SLOT_NECK,
    CONSTS.EQUIPMENT_SLOT_CHEST,
    CONSTS.EQUIPMENT_SLOT_BACK,
    CONSTS.EQUIPMENT_SLOT_ARMS,
    CONSTS.EQUIPMENT_SLOT_RIGHT_FINGER,
    CONSTS.EQUIPMENT_SLOT_LEFT_FINGER,
    CONSTS.EQUIPMENT_SLOT_WAIST,
    CONSTS.EQUIPMENT_SLOT_FEET,
    CONSTS.EQUIPMENT_SLOT_SHIELD,
    CONSTS.EQUIPMENT_SLOT_NATURAL_ARMOR
]

/**
 * Liste des éléments constituant l'équipement défensif (tous sauf armes et munitions)
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {D20Item[]}
 */
function getDefensiveEquipmentList (state, getters) {
    const oEquipItems = getters.getEquippedItems
    return aSlots
        .map(s => oEquipItems[s])
        .filter(item => !!item)
}

/**
 * Liste des éléments constituant l'équipement offensif ou défensif (inclue l'arme séléectionnée et munitions si l'arme est à distance)
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {D20Item[]}
 */
module.exports = (state, getters) => {
    const eq = getDefensiveEquipmentList(state, getters)
    const oWeapon = getters.getSelectedWeapon
    if (oWeapon) {
        eq.push(oWeapon)
        if (oWeapon.attributes.includes(CONSTS.WEAPON_ATTRIBUTE_RANGED)) {
            const oAmmo = getters.getEquippedItems[CONSTS.EQUIPMENT_SLOT_AMMO]
            if (oAmmo) {
                eq.push(oAmmo)
            }
        }
    }
    return eq
}
