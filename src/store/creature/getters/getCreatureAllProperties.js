/**
 * Liste des propriétés des équipements défensifs (armure, bouclier etc...) et des propriétés innées
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {[]}
 */
module.exports = (state, getters) => {
    const cip = getters.getCreatureInnateProperties
    const eep = getters.getEquipmentExtraProperties
    return cip.concat(eep)
}

