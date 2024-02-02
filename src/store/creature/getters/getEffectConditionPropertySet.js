/**
 * Renvoie l'ensemble des effets, conditions, proriétés d'objet qui affecte la créature, sans se soucier des amplitude
 * Ce getter permet de rapidement interroger les trucs qui affecte la créature
 * @return {Set<string>}
 */

module.exports = (state, getters) => new Set([
    ...getters.getEffectSet,
    ...getters.getConditionSet,
    ...getters.getEquipmentItemPropertySet
])