const { computeRuleValue } = require('../common/compute-rule-value')
const { getDisAndAdvEffectRegistry, getThoseProvidedByEffects } = require("../common/get-disandadv-effect-registry");
const CONSTS = require("../../../consts");

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
module.exports = (state, getters, externals) => {
    const myConditions = getters.getConditions
    const myConditionSources = getters.getConditionSources

    const oRelevantEffects = getters
        .getEffects
        .filter(effect => effect.type === CONSTS.EFFECT_ADVANTAGE)
    const oDisadvantageEffectRegistry = getDisAndAdvEffectRegistry(oRelevantEffects)

    const EXHAUSTION_LEVEL_3 = getters.getExhaustionLevel >= 3
    const EXHAUSTION_LEVEL_1 = getters.getExhaustionLevel >= 1
    const NON_PROFICIENT_ARMOR_SHIELD = !getters.isProficientArmorAndShield
    const WEARING_NON_STEALTH_ARMOR = getters.isWearingStealthDisadvantagedArmor
    const TARGET_UNSEEN = !getters.getEntityVisibility.detectable.target && getters.getEntityVisibility.detectedBy.target
    const CREATURE_IS_SMALL = getters.getSizeProperties.value < externals.data['creature-size'][CONSTS.CREATURE_SIZE_MEDIUM].value
    const HEAVY_WEAPON = getters.isWeildingNonLightWeapon && CREATURE_IS_SMALL

    const POISONED = myConditions.has(CONSTS.CONDITION_POISONED)

    return {
        ROLL_TYPE_ATTACK: {
            ABILITY_STRENGTH: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NON_PROFICIENT_ARMOR_SHIELD,
                TARGET_UNSEEN,
                POISONED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_STRENGTH)
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NON_PROFICIENT_ARMOR_SHIELD,
                TARGET_UNSEEN,
                POISONED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_DEXTERITY)
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                TARGET_UNSEEN,
                POISONED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_CONSTITUTION)
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                TARGET_UNSEEN,
                POISONED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_INTELLIGENCE)
            }),
            ABILITY_WISDOM: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                TARGET_UNSEEN,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_WISDOM)
            }),
            ABILITY_CHARISMA: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                TARGET_UNSEEN,
                POISONED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_CHARISMA)
            })
        },
        ROLL_TYPE_SAVE: {
            ABILITY_STRENGTH: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NON_PROFICIENT_ARMOR_SHIELD,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_STRENGTH)
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NON_PROFICIENT_ARMOR_SHIELD,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_DEXTERITY)
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_CONSTITUTION)
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_INTELLIGENCE)
            }),
            ABILITY_WISDOM: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_WISDOM)
            }),
            ABILITY_CHARISMA: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_CHARISMA)
            })
        },
        ROLL_TYPE_CHECK: {
            ABILITY_STRENGTH: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                NON_PROFICIENT_ARMOR_SHIELD,
                POISONED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_STRENGTH)
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                NON_PROFICIENT_ARMOR_SHIELD,
                POISONED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_DEXTERITY)
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                POISONED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_CONSTITUTION)
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                POISONED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_INTELLIGENCE)
            }),
            ABILITY_WISDOM: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                POISONED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_WISDOM)
            }),
            ABILITY_CHARISMA: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                POISONED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_CHARISMA)
            }),
            SKILL_STEALTH: computeRuleValue({
                WEARING_NON_STEALTH_ARMOR,
                POISONED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.SKILL_STEALTH)
            })
        }
    }
}