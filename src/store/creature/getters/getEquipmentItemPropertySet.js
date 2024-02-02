/**
 * Liste simple des propriétés des équipements défensif (armure, bouclier etc...) et offensif (armes)
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {Set<string>}
 */
module.exports = (state, getters) => new Set(getters.getEquipmentItemProperties.map(ip => ip.type))
