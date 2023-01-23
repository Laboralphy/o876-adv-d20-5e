const { computeRuleValue } = require('../common/compute-rule-value')

/**
 * Etabli la liste des désavantages de THIS par rapport à THIS.target
 * ROLL_TYPE_ATTACK : liste des désavantages de THIS quand il effectue un jet d'attaque sur THIS.target
 * ROLL_TYPE_SAVE : liste des désavantages de THIS quand il effectue un jet de sauvegarde contre une attaque de THIS.target
 * ROLL_TYPE_CHECK : liste des désavantages de THIS quand il lance un jet de compétence contre THIS.target
 * (dans le cas de compétence d'attaque) ou pour agresseur (dans le cas de compétence de défense)
 * @param state
 * @param getters
 * @return {D20AdvantagesOrDisadvantages}
 */
module.exports = (state, getters) => {
    const EXHAUSTION_LEVEL_3 = getters.getExhaustionLevel >= 3
    const EXHAUSTION_LEVEL_1 = getters.getExhaustionLevel >= 1
    const NON_PROFICIENT_ARMOR_SHIELD = !getters.isProficientArmorAndShield
    const WEARING_NON_STEALTH_ARMOR = getters.isWearingStealthDisadvantagedArmor
    const NOT_HIDDEN_AND_TARGET_INVISIBLE = !getters.getEntityVisibility.detectable.target
    return {
        ROLL_TYPE_ATTACK: {
            ABILITY_STRENGTH: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NON_PROFICIENT_ARMOR_SHIELD,
                NOT_HIDDEN_AND_TARGET_INVISIBLE
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NON_PROFICIENT_ARMOR_SHIELD,
                NOT_HIDDEN_AND_TARGET_INVISIBLE
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NOT_HIDDEN_AND_TARGET_INVISIBLE
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NOT_HIDDEN_AND_TARGET_INVISIBLE
            }),
            ABILITY_WISDOM: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NOT_HIDDEN_AND_TARGET_INVISIBLE
            }),
            ABILITY_CHARISMA: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NOT_HIDDEN_AND_TARGET_INVISIBLE
            })
        },
        ROLL_TYPE_SAVE: {
            ABILITY_STRENGTH: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NON_PROFICIENT_ARMOR_SHIELD
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NON_PROFICIENT_ARMOR_SHIELD
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                EXHAUSTION_LEVEL_3
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                EXHAUSTION_LEVEL_3
            }),
            ABILITY_WISDOM: computeRuleValue({
                EXHAUSTION_LEVEL_3
            }),
            ABILITY_CHARISMA: computeRuleValue({
                EXHAUSTION_LEVEL_3
            })
        },
        ROLL_TYPE_CHECK: {
            ABILITY_STRENGTH: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                NON_PROFICIENT_ARMOR_SHIELD
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                NON_PROFICIENT_ARMOR_SHIELD
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                EXHAUSTION_LEVEL_1
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                EXHAUSTION_LEVEL_1
            }),
            ABILITY_WISDOM: computeRuleValue({
                EXHAUSTION_LEVEL_1
            }),
            ABILITY_CHARISMA: computeRuleValue({
                EXHAUSTION_LEVEL_1
            }),
            SKILL_STEALTH: computeRuleValue({
                WEARING_NON_STEALTH_ARMOR
            })
        }
    }
}