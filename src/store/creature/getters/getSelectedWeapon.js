const CONSTS = require('../../../consts')
/**
 * Arme actuellement équipée
 * @param state
 * @returns {D20Item}
 */
module.exports = state => {
    return state.equipment[state.offensiveSlot] || state.equipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON]
}
