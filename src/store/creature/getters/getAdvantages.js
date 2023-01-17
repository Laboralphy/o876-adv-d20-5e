const { computeRuleValue } = require('../common/compute-rule-value')

/**
 * Etabli la liste des avantages de THIS par rapport à sa cible THIS.target
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @return {D20AdvantagesOrDisadvantages}
 */
module.exports = (state, getters) => {
    /*
    Commencer par définir les règles.
    Ces règles permettront au système d'afficher pour quelles raisons on bénéficie ou pas d'un avantage
     */
    const TARGET_CANNOT_SEE_ME = !getters.canTargetSeeMe
    /*
    Définir l'ossature D20AdvantagesOrDisadvantages
     */
    return {
        ROLL_TYPE_ATTACK: {
            ABILITY_STRENGTH: computeRuleValue({
                TARGET_CANNOT_SEE_ME
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                TARGET_CANNOT_SEE_ME
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                TARGET_CANNOT_SEE_ME
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                TARGET_CANNOT_SEE_ME
            }),
            ABILITY_WISDOM: computeRuleValue({
                TARGET_CANNOT_SEE_ME
            }),
            ABILITY_CHARISMA: computeRuleValue({
                TARGET_CANNOT_SEE_ME
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
        ROLL_TYPE_SKILL: {
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
        }
    }
}
