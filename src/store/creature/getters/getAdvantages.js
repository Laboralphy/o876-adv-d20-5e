const { computeRuleValue } = require('../common/compute-rule-value')
const CONDITIONS = require("../../../consts/conditions.json");

/**
 * Etabli la liste des avantages de THIS par rapport à sa cible THIS.target
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @return {D20AdvantagesOrDisadvantages}
 */
module.exports = (state, getters) => {
    const myConditions = getters.getConditions
    const myConditionSources = getters.getConditionSources
    const targetConditions = getters.getTargetConditions
    const targetConditionSources = getters.getTargetConditionSources
    const aggressorConditions = getters.getAggressorConditions
    const aggressorConditionSources = getters.getAggressorConditionSources
    const myID = getters.getId

    /**
     * Returns true if the condition is generated by this
     * @param sCondition
     * @returns {*}
     */
    const targetAffectedByMe = sCondition => targetConditions.has(sCondition) &&
        targetConditionSources[sCondition].has(myID)

    /*
    Commencer par définir les règles.
    Ces règles permettront au système d'afficher pour quelles raisons on bénéficie ou pas d'un avantage
     */

    // TARGET_CHARMED : La cible est charmée par this
    const TARGET_CHARMED = targetAffectedByMe(CONDITIONS.CONDITION_CHARMED)

    // TARGET_INCAPACITATED : La cible ne peut pas se défendre
    const TARGET_INCAPACITATED = targetConditions.has(CONDITIONS.CONDITION_INCAPACITATED)

    // UNDETECTED : La cible est visible, mais this est invisible pour elle
    const UNDETECTED = getters.getEntityVisibility.detectable.target &&
        !getters.getEntityVisibility.detectedBy.target

    /*
    Définir l'ossature D20AdvantagesOrDisadvantages
     */
    return {
        ROLL_TYPE_ATTACK: {
            ABILITY_STRENGTH: computeRuleValue({
                UNDETECTED,
                TARGET_INCAPACITATED
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                UNDETECTED,
                TARGET_INCAPACITATED
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                UNDETECTED,
                TARGET_INCAPACITATED
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                UNDETECTED,
                TARGET_INCAPACITATED
            }),
            ABILITY_WISDOM: computeRuleValue({
                UNDETECTED,
                TARGET_INCAPACITATED
            }),
            ABILITY_CHARISMA: computeRuleValue({
                UNDETECTED,
                TARGET_INCAPACITATED
            })
        },
        ROLL_TYPE_SAVE: {
            ABILITY_STRENGTH: computeRuleValue({
            }),
            ABILITY_DEXTERITY: computeRuleValue({
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
            }),
            ABILITY_WISDOM: computeRuleValue({
            }),
            ABILITY_CHARISMA: computeRuleValue({
            })
        },
        ROLL_TYPE_CHECK: {
            ABILITY_STRENGTH: computeRuleValue({
            }),
            ABILITY_DEXTERITY: computeRuleValue({
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                TARGET_CHARMED
            }),
            ABILITY_WISDOM: computeRuleValue({
                TARGET_CHARMED
            }),
            ABILITY_CHARISMA: computeRuleValue({
                TARGET_CHARMED
            })
        }
    }
}
