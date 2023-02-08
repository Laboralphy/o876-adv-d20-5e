const {propertyMapper} = require("../common/property-mapper")
/**
 * Liste des propriétés de l'arme équipée et des munitions dans le cas d'arme à distance utilisant des munitions
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {array}
 */
module.exports = (state, getters) => {
    return propertyMapper(getters.getOffensiveEquipmentList.map(w => w.properties).flat(), getters)
}