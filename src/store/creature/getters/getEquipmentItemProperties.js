/**
 * Liste des propriétés des équippement défensif (armure, bouclier etc...)
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {[]}
 */
module.exports = (state, getters) =>
    getters
        .getEquipmentList
        .map(item => item
            .properties
            .map(prop => ({
                ...prop,
                tag: item.ref
            }))
        )
        .flat()
