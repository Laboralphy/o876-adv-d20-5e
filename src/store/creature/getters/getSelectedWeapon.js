const CONSTS = require('../../../consts')
/**
 * Arme actuellement équipée
 * @param state
 * @returns {D20Item}
 */
module.exports = state => {
    let oWeapon = state.equipment[state.offensiveSlot]
    if (!oWeapon) {
        oWeapon = state.equipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON]
    }
    return oWeapon
}
