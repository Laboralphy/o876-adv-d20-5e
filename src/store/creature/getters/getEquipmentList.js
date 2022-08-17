const CONSTS = require('../../../consts')

/**
 * Liste des éléments constituant l'équipement offensif ou défensif (inclue l'arme séléectionnée et munitions si l'arme est à distance)
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {D20Item[]}
 */
module.exports = (state, getters) => {
    return [
        ...getters.getDefensiveEquipmentList,
        ...getters.getOffensiveEquipmentList
    ]
}
