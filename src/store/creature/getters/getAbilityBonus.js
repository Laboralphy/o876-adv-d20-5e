const CONFIG = require('../../../config')

module.exports = state => {
    const oAbilities = {}
    for (const sAbility of Object.keys(state.abilities)) {
        oAbilities[sAbility] = state
            .effects
            .filter(eff => eff.tag === CONFIG.EFFECT_ABILITY_MODIFIER && eff.data.ability === sAbility)
            .reduce((value, eff) => value + eff.amp, 0)
    }
    return oAbilities
}