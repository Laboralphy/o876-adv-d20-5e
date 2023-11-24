const CONSTS = require('../../../../../consts')
/**
 * "The DC to resist one of your spells equals 8 + your spellcasting ability modifier + your proficiency bonus + any special modifiers."
 * @param state
 * @param getters
 * @return {number}
 */
module.exports = (state, getters) => {
    const nAbilityModifier = getters.getAbilityModifiers[CONSTS.ABILITY_INTELLIGENCE]
    const nProfBonus = getters.getProficiencyBonus
    return 8 + nAbilityModifier + nProfBonus
}