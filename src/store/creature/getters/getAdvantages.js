const { computeRuleValue } = require('../common/compute-rule-value')
const CONDITIONS = require("../../../consts/conditions.json");

/**
 * Etabli la liste des avantages de THIS par rapport à sa cible THIS.target
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @return {D20AdvantagesOrDisadvantages}
 */
module.exports = (state, getters) => {
    const targetConditions = getters.getTargetConditions
    const myConditions = getters.getConditions
    /*
    Commencer par définir les règles.
    Ces règles permettront au système d'afficher pour quelles raisons on bénéficie ou pas d'un avantage
     */

    // La cible est charmée (mais on ne sait pas par qui, malheureusement)
    const TARGET_CHARMED = targetConditions.has(CONDITIONS.CONDITION_CHARMED)
    // La cible doit être un ennemi favori du joueur
    const FAVORED_ENEMY = false


    const HIDDEN_AND_TARGET_VISIBLE = !getters.canTargetSeeMe && getters.canSeeTarget
    /*
    Définir l'ossature D20AdvantagesOrDisadvantages
     */
    return {
        ROLL_TYPE_ATTACK: {
            ABILITY_STRENGTH: computeRuleValue({
                HIDDEN_AND_TARGET_VISIBLE
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                HIDDEN_AND_TARGET_VISIBLE
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                HIDDEN_AND_TARGET_VISIBLE
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                HIDDEN_AND_TARGET_VISIBLE
            }),
            ABILITY_WISDOM: computeRuleValue({
                HIDDEN_AND_TARGET_VISIBLE
            }),
            ABILITY_CHARISMA: computeRuleValue({
                HIDDEN_AND_TARGET_VISIBLE
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
