function getDisAndAdvEffectRegistry (effects) {
    const oDisAndAdvEffectRegistry = {}
    effects
        .forEach(effect => {
            const effectData = effect.data
            effectData.rollTypes.forEach(rt => {
                effectData.abilities.forEach(ab => {
                    if (!(rt in oDisAndAdvEffectRegistry)) {
                        oDisAndAdvEffectRegistry[rt] = {}
                    }
                    const oAdvEffRegRoll = oDisAndAdvEffectRegistry[rt]
                    if (!(ab in oAdvEffRegRoll)) {
                        oAdvEffRegRoll[ab] = []
                    }
                    oAdvEffRegRoll[ab].push(effectData.label)
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
