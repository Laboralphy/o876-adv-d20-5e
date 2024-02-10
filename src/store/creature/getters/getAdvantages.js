const { computeRuleValue } = require('../common/compute-rule-value')
const CONSTS = require("../../../consts");
const { targetAffectedByMe, getDisAndAdvEffectRegistry, getThoseProvidedByEffects } = require("../common/get-disandadv-effect-registry");

/**
 * Etabli la liste des avantages de THIS par rapport à sa cible THIS.target
 * @param state {object}
 * @param getters {D20CreatureStoreGetters}
 * @return {D20AdvantagesOrDisadvantages}
 */
module.exports = (state, getters) => {
    const targetConditions = getters.getTargetConditionSet
    const oAdvantageEffectRegistry = getters.getAdvantagePropEffects
    const targetEffects = getters.getTargetEffectSet

    /*
    Commencer par définir les règles.
    Ces règles permettront au système d'afficher pour quelles raisons on bénéficie ou pas d'un avantage
     */

    // TARGET_CHARMED : La cible est charmée par this
    const TARGET_CHARMED = targetAffectedByMe(CONSTS.CONDITION_CHARMED, getters)

    // TARGET_INCAPACITATED : La cible ne peut pas se défendre
    const TARGET_INCAPACITATED = targetConditions.has(CONSTS.CONDITION_INCAPACITATED)

    // UNDETECTED : La cible ne peut pas détecter this, mais this perçoit la cible
    const UNDETECTED = getters.getEntityVisibility.detectable.target &&
        !getters.getEntityVisibility.detectedBy.target

    // TARGET_PRONE_AND_CLOSE : La cible est à terre et proche (une cible à terre et loin est plus difficile à toucher)
    const TARGET_PRONE_AND_CLOSE = targetConditions.has(CONSTS.CONDITION_PRONE) && getters.isTargetInMeleeWeaponRange

    const TARGET_ELUSIVE = targetEffects.has(CONSTS.EFFECT_ELUSIVE)

    /*
    Définir l'ossature D20AdvantagesOrDisadvantages
     */
    return {
        ROLL_TYPE_ATTACK: {
            ABILITY_STRENGTH: computeRuleValue({
                UNDETECTED,
                TARGET_INCAPACITATED,
                TARGET_PRONE_AND_CLOSE,
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_STRENGTH)
            }, TARGET_ELUSIVE),
            ABILITY_DEXTERITY: computeRuleValue({
                UNDETECTED,
                TARGET_INCAPACITATED,
                TARGET_PRONE_AND_CLOSE,
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_DEXTERITY)
            }, TARGET_ELUSIVE),
            ABILITY_CONSTITUTION: computeRuleValue({
                UNDETECTED,
                TARGET_INCAPACITATED,
                TARGET_PRONE_AND_CLOSE,
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_CONSTITUTION)
            }, TARGET_ELUSIVE),
            ABILITY_INTELLIGENCE: computeRuleValue({
                UNDETECTED,
                TARGET_INCAPACITATED,
                TARGET_PRONE_AND_CLOSE,
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_INTELLIGENCE)
            }, TARGET_ELUSIVE),
            ABILITY_WISDOM: computeRuleValue({
                UNDETECTED,
                TARGET_INCAPACITATED,
                TARGET_PRONE_AND_CLOSE,
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_WISDOM)
            }, TARGET_ELUSIVE),
            ABILITY_CHARISMA: computeRuleValue({
                UNDETECTED,
                TARGET_INCAPACITATED,
                TARGET_PRONE_AND_CLOSE,
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_CHARISMA)
            }, TARGET_ELUSIVE)
        },
        ROLL_TYPE_SAVE: {
            ABILITY_STRENGTH: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_STRENGTH)
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_DEXTERITY)
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_CONSTITUTION)
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_INTELLIGENCE)
            }),
            ABILITY_WISDOM: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_WISDOM)
            }),
            ABILITY_CHARISMA: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_CHARISMA)
            }),
            THREAT_TYPE_DISEASE: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_DISEASE)
            }),
            THREAT_TYPE_FEAR: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_FEAR)
            }),
            THREAT_TYPE_MIND_SPELL: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_MIND_SPELL)
            }),
            THREAT_TYPE_POISON: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_POISON)
            }),
            THREAT_TYPE_SPELL: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_SPELL)
            }),
            THREAT_TYPE_TRAP: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_TRAP)
            }),
            THREAT_TYPE_DEATH: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_DEATH)
            })
        },
        ROLL_TYPE_CHECK: {
            ABILITY_STRENGTH: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_STRENGTH)
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_DEXTERITY)
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_CONSTITUTION)
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                TARGET_CHARMED,
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_INTELLIGENCE)
            }),
            ABILITY_WISDOM: computeRuleValue({
                TARGET_CHARMED,
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_WISDOM)
            }),
            ABILITY_CHARISMA: computeRuleValue({
                TARGET_CHARMED,
                ...getThoseProvidedByEffects(oAdvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_CHARISMA)
            })
        }
    }
}
