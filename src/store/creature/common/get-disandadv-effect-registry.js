function getDisAndAdvEffectRegistry (effects) {
    const oDisAndAdvEffectRegistry = {}
    effects
        .forEach(effect => {
            effect.rollTypes.forEach(rt => {
                effect.abilities.forEach(ab => {
                    if (!(rt in oDisAndAdvEffectRegistry)) {
                        oDisAndAdvEffectRegistry[rt] = {}
                    }
                    const oAdvEffRegRoll = oDisAndAdvEffectRegistry[rt]
                    if (!(ab in oAdvEffRegRoll)) {
                        oAdvEffRegRoll[ab] = []
                    }
                    oAdvEffRegRoll[ab].push(effect.label)
                })
            })
        })
    return oDisAndAdvEffectRegistry
}

function getThoseProvidedByEffects (oRegistry, sRollType, sAbility) {
    const oResult = {}
    if ((sRollType in oRegistry) && (sAbility in oRegistry[sRollType])) {
        oRegistry[sRollType][sAbility].forEach(lab => {
            oResult[lab] = true
        })
    }
    return oResult
}

module.exports = {
    getDisAndAdvEffectRegistry,
    getThoseProvidedByEffects
}
