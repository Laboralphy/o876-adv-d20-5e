/**
 * Renvoie le bonus de la caractéristique offensive
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => {
    const sOffensiveAbility = getters.getOffensiveAbility
    return getters.getAbilityModifiers[sOffensiveAbility]
}
