const CONSTS = require("../../../../../consts");
const { computeRuleValue } = require('../../../../../store/creature/common/compute-rule-value')
const { targetAffectedByMe, getDisAndAdvEffectRegistry, getThoseProvidedByEffects } = require("../../../../../store/creature/common/get-disandadv-effect-registry");

/**
 * Etabli la liste des avantages de THIS par rapport à sa cible THIS.target
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @return {D20AdvantagesOrDisadvantages}
 */
module.exports = (state, getters) => {
    const oAdvantageEffectRegistry = getters.getAdvantagePropEffects

    /*
    Commencer par définir les règles.
    Ces règles permettront au système d'afficher pour quelles raisons on bénéficie ou pas d'un avantage
     */

    // TARGET_CHARMED : La cible est charmée par this
    const TARGET_CHARMED = targetAffectedByMe(CONSTS.CONDITION_CHARMED, getters)

    /*
    Définir l'ossature D20AdvantagesOrDisadvantages
     */
    return {
        SKILL_ACROBATICS: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_ACROBATICS')
        }),
        SKILL_ANIMAL_HANDLING: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_ANIMAL_HANDLING')
        }),
        SKILL_ARCANA: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_ARCANA')
        }),
        SKILL_ATHLETICS: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_ATHLETICS')
        }),
        SKILL_DECEPTION: computeRuleValue({
            TARGET_CHARMED,
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_DECEPTION')
        }),
        SKILL_DISARM_TRAP: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_DISARM_TRAP')
        }),
        SKILL_HISTORY: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_HISTORY')
        }),
        SKILL_INSIGHT: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_INSIGHT')
        }),
        SKILL_INTIMIDATION: computeRuleValue({
            TARGET_CHARMED,
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_INTIMIDATION')
        }),
        SKILL_INVESTIGATION: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_INVESTIGATION')
        }),
        SKILL_MEDICINE: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_MEDICINE')
        }),
        SKILL_NATURE: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_NATURE')
        }),
        SKILL_PERFORMANCE: computeRuleValue({
            TARGET_CHARMED,
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_PERFORMANCE')
        }),
        SKILL_PERSUASION: computeRuleValue({
            TARGET_CHARMED,
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_PERSUASION')
        }),
        SKILL_RELIGION: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_RELIGION')
        }),
        SKILL_SLEIGHT_OF_HAND: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_SLEIGHT_OF_HAND')
        }),
        SKILL_STEALTH: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_STEALTH')
        }),
        SKILL_SURVIVAL: computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'SKILL_SURVIVAL')
        })
    }
}
