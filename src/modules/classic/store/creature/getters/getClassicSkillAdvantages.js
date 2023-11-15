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
        'skill-acrobatics': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-acrobatics')
        }),
        'skill-animal-handling': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-animal-handling')
        }),
        'skill-arcana': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-arcana')
        }),
        'skill-athletics': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-athletics')
        }),
        'skill-deception': computeRuleValue({
            TARGET_CHARMED,
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-deception')
        }),
        'skill-history': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-history')
        }),
        'skill-insight': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-insight')
        }),
        'skill-intimidation': computeRuleValue({
            TARGET_CHARMED,
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-intimidation')
        }),
        'skill-investigation': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-investigation')
        }),
        'skill-medicine': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-medicine')
        }),
        'skill-nature': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-nature')
        }),
        'skill-performance': computeRuleValue({
            TARGET_CHARMED,
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-performance')
        }),
        'skill-persuasion': computeRuleValue({
            TARGET_CHARMED,
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-persuasion')
        }),
        'skill-religion': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-religion')
        }),
        'skill-sleight-of-hand': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-sleight-of-hand')
        }),
        'skill-stealth': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-stealth')
        }),
        'skill-survival': computeRuleValue({
            ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, 'skill-survival')
        })
    }
}
