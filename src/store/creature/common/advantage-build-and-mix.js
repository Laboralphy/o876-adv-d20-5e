
function mix (r, rules) {
    const o = {
        rules: {},
        value: false
    }
    r.forEach(r1 => {
        const r2 = rules[r1]
        o.rules[r1] = r2
        o.value = o.value || r2
    })
    return o
}

/**
 *
 * @param state
 * @param getters
 * @param rules
 * @param oDefinition {Object.<string, object>}
 * @returns {{}}
 */
function build (state, getters, rules, oDefinition) {
    const oOutput = {}
    for (const [sRollType, oRollType] of Object.entries(oDefinition)) {
        oOutput[sRollType] = {}
        for (const [sRubrique, oRubrique] of Object.entries(oRollType)) {
            oOutput[sRollType][sRubrique] = {}
            for (const [s, aDefinition] of Object.entries(oRubrique)) {
                oOutput[sRollType][sRubrique][s] = mix(aDefinition, rules)
            }
        }
    }
    return oOutput
}

module.exports = {
    build,
    mix
}
