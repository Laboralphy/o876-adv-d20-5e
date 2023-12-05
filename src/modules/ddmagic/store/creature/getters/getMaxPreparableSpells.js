const CONSTS = require('../../../../../consts')

/**
 *
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => {
    // niveau de mage + modificateur d'intelligence
    return Math.max(1, getters.getWizardLevel + getters.getAbilityModifiers[CONSTS.ABILITY_INTELLIGENCE])
}