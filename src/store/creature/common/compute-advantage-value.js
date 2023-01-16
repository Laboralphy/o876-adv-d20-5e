/**
 * @param rv {D20RuleValue}
 * @return {boolean}
 */
function computeRuleValue (rv) {
    return Object.values(rv.rules).reduce((prev, curr) => prev || curr, false)
}

/**
 *
 * @param rvr {D20RuleValueRegistry}
 */
function computeAllRuleValues (rvr) {
    for (const [sAttribute, oAttribute] in Object.entries(rvr)) {

    }
}



/**
 * @param data {D20AdvantagesOrDisadvantages}
 * @returns {D20AdvantagesOrDisadvantages}
 */
module.exports = function (data) {
    for (const [sRollType, d1] of Object.entries(data)) {
        for (const [sOrigin, d2] of Object.entries(d1)) {
            for (const [sMetric, d3] of Object.entries(d2)) {
                d3.value = Object.values(d3.rules).reduce((prev, curr) => prev || curr, false)
            }
        }
    }
    return data
}