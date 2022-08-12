/**
 *
 * @param state
 * @param getters
 * @returns {D20AbilityNumberRegistry}
 */
module.exports = (state, getters) => {
    const oAbilities = {}
    for (const sAbility of Object.keys(state.abilities)) {
        oAbilities[sAbility] = getters.getAbilityBaseValues[sAbility] + getters.getAbilityBonus[sAbility]
    }
    return oAbilities
}