module.exports = (state, getters) => {
    const oAbilities = {}
    for (const sAbility of Object.keys(state.abilities)) {
        oAbilities[sAbility] = Math.floor((getters.getAbilityValues[sAbility] - 10) / 2)
    }
    return oAbilities
}
