/**
 * Registre associant les caractéristiques et leur valeur de base (sans bonus)
 * @param state
 * @returns {D20AbilityNumberRegistry}
 */
module.exports = state => {
    const oAbilities = {}
    for (const [sAbility, nValue] of Object.entries(state.abilities)) {
        oAbilities[sAbility] = nValue
    }
    return oAbilities
}