/**
 * @param def {{ [id: string]: boolean}}
 * @param cancel {boolean} si true alors on annule toutes les rules.
 * @return {D20RuleValue}
 */
function computeRuleValue (def, cancel = false) {
    if (cancel) {
        return {
            rules: [],
            value: false
        }
    }
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