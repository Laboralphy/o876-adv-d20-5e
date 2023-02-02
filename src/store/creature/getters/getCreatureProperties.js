/**
 * Liste des propriétés intrinseques de la créature
 * @param state
 * @returns {[]}
 */
module.exports = (state, getters) => [
    ...state.properties,
    ...getters.getEquipmentExtraProperties
]

