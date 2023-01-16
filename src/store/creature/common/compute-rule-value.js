/**
 * @param def {{ [id: string]: boolean}}
 * @return {D20RuleValue}
 */
function computeRuleValue (def) {
    const rules = []
    for (const [sRule, pRule] of Object.entries(def)) {
        if (pRule) {
            rules.push(sRule)
        }
    }
    return {
        rules,
        value: rules.length > 0
    }
}

module.exports = {
    computeRuleValue
}