/**
 * Registre associant des caractéristiques et leurs modificateurs (((valeur + bonus) - 10) / 2)
 * @param state
 * @param getters
 * @returns {D20AbilityNumberRegistry}
 */
module.exports = (state, getters) => {
    const oAbilities = {}
    for (const sAbility of Object.keys(state.abilities)) {
        oAbilities[sAbility] = Math.floor((getters.getAbilityValues[sAbility] - 10) / 2)
    }
    return oAbilities
}
