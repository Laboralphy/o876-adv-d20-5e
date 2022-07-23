module.exports = state => {
    const oAbilities = {}
    for (const [sAbility, nValue] of Object.entries(state.abilities)) {
        oAbilities[sAbility] = nValue
    }
    return oAbilities
}