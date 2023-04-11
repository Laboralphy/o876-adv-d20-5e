/**
 * Renvoie les données concernant la taille de la créature (value, carrying capacity, space...)
 * @param state
 * @param getters
 * @param externals
 * @return {{value: number, hitDice: number, space: number, carryingCapacity}}
 */
module.exports = (state, getters, externals) => externals.data['creature-sizes'][getters.getSize]
