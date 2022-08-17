const { build } = require('../common/advantage-build-and-mix')
/**
 * Etabli la liste des désavantages
 * @param state
 * @param getters
 * @param data {{}}
 * @return {D20AdvantagesOrDisadvantages}
 */
module.exports = (state, getters, { data }) => {
    return build(state, getters, getters.getDisadvantageRules, data['disadvantage-definition'])
}