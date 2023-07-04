const { computeRuleValue } = require('../common/compute-rule-value')
const { getDisAndAdvEffectRegistry, getThoseProvidedByEffects } = require("../common/get-disandadv-effect-registry");
const CONSTS = require("../../../consts");

/**
 * Etabli la liste des désavantages de THIS par rapport à THIS.target
 * ROLL_TYPE_ATTACK : liste des désavantages de THIS quand il effectue un jet d'attaque sur THIS.target
 * ROLL_TYPE_SAVE : liste des désavantages de THIS quand il effectue un jet de sauvegarde contre une attaque de THIS.target
 * ROLL_TYPE_CHECK : liste des désavantages de THIS quand il lance un jet de compétence contre THIS.target
 * (dans le cas de compétence d'attaque) ou pour agresseur (dans le cas de compétence de défense)
 * @param state {object}
 * @param getters {D20CreatureStoreGetters}
 * @param externals {object}
 * @return {D20AdvantagesOrDisadvantages}
 */
module.exports = (state, getters, externals) => {
    const myConditions = getters.getConditions
    const targetConditions = getters.getTargetConditions

    const oDisadvantageEffectRegistry = getters.getDisadvantagePropEffects

    // Créature très fatiguée
    const EXHAUSTION_LEVEL_3 = getters.getExhaustionLevel >= 3

    // Créature modérément fatiguée
    const EXHAUSTION_LEVEL_1 = getters.getExhaustionLevel >= 1

    // La créature est équippée d'une armure ou d'un bouclier pour lesquels elle n'a pas la proficiency
    const NON_PROFICIENT_ARMOR_SHIELD = !getters.isProficientArmorAndShield

    // La cible est cachée ou invisible
    const TARGET_UNSEEN = !getters.getEntityVisibility.detectable.target && getters.getEntityVisibility.detectedBy.target

    // La créature est de petite taille
    const CREATURE_IS_SMALL = getters.getSizeProperties.value < externals.data['creature-sizes'][CONSTS.CREATURE_SIZE_MEDIUM].value

    // L'arme équipée est trop lourde pour le personnage
    const HEAVY_WEAPON = getters.isWieldingNonLightWeapon && CREATURE_IS_SMALL

    // La créature subit la condition "poison"
    const POISONED = myConditions.has(CONSTS.CONDITION_POISONED)

    // La créature subit la condition "terreur"
    const FRIGHTENED = myConditions.has(CONSTS.CONDITION_FRIGHTENED)

    // La créature subit la condition "restriction de mouvement"
    const RESTRAINED = myConditions.has(CONSTS.CONDITION_RESTRAINED)

    // La créature est à terre
    const PRONE = myConditions.has(CONSTS.CONDITION_PRONE)

    // La créature est encombrée
    const LIGHTLY_ENCUMBERED = getters.getEncumbranceLevel === 1

    // La créature est lourdement encombrée
    const HEAVILY_ENCUMBERED = getters.getEncumbranceLevel >= 2

    // La créature est sous l'eau et n'a pas de capacité sous-marine
    const af = getters.getAreaFlags
    const AREA_UNDERWATER = af.has(CONSTS.AREA_FLAG_UNDERWATER)

    // La créature est dans une pièce obscure sans capacité de vision nocturne

    // La cible de la créature est trop proche lorsque l'on possède une arme à distance
    const TARGET_TOO_CLOSE = getters.isWieldingRangedWeapon && getters.isTargetInMeleeWeaponRange

    // La cible de la créature est à terre mais, loin... l'attaquer avec une arme à distance constitue un désavantage.
    const TARGET_PRONE_AND_FAR = targetConditions.has(CONSTS.CONDITION_PRONE) && !getters.isTargetInMeleeWeaponRange


    return {
        ROLL_TYPE_ATTACK: {
            ABILITY_STRENGTH: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NON_PROFICIENT_ARMOR_SHIELD,
                TARGET_UNSEEN,
                POISONED,
                PRONE,
                TARGET_PRONE_AND_FAR,
                FRIGHTENED,
                RESTRAINED,
                HEAVY_WEAPON,
                HEAVILY_ENCUMBERED,
                AREA_UNDERWATER,
                TARGET_TOO_CLOSE,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_STRENGTH)
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NON_PROFICIENT_ARMOR_SHIELD,
                TARGET_UNSEEN,
                POISONED,
                PRONE,
                TARGET_PRONE_AND_FAR,
                FRIGHTENED,
                RESTRAINED,
                HEAVY_WEAPON,
                HEAVILY_ENCUMBERED,
                AREA_UNDERWATER,
                TARGET_TOO_CLOSE,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_DEXTERITY)
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                TARGET_UNSEEN,
                POISONED,
                PRONE,
                TARGET_PRONE_AND_FAR,
                FRIGHTENED,
                RESTRAINED,
                HEAVY_WEAPON,
                HEAVILY_ENCUMBERED,
                AREA_UNDERWATER,
                TARGET_TOO_CLOSE,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_CONSTITUTION)
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                TARGET_UNSEEN,
                POISONED,
                PRONE,
                TARGET_PRONE_AND_FAR,
                FRIGHTENED,
                RESTRAINED,
                HEAVY_WEAPON,
                HEAVILY_ENCUMBERED,
                AREA_UNDERWATER,
                TARGET_TOO_CLOSE,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_INTELLIGENCE)
            }),
            ABILITY_WISDOM: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                TARGET_UNSEEN,
                POISONED,
                PRONE,
                TARGET_PRONE_AND_FAR,
                FRIGHTENED,
                RESTRAINED,
                HEAVY_WEAPON,
                HEAVILY_ENCUMBERED,
                AREA_UNDERWATER,
                TARGET_TOO_CLOSE,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_WISDOM)
            }),
            ABILITY_CHARISMA: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                TARGET_UNSEEN,
                POISONED,
                PRONE,
                TARGET_PRONE_AND_FAR,
                FRIGHTENED,
                RESTRAINED,
                HEAVY_WEAPON,
                HEAVILY_ENCUMBERED,
                AREA_UNDERWATER,
                TARGET_TOO_CLOSE,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_ATTACK, CONSTS.ABILITY_CHARISMA)
            })
        },
        ROLL_TYPE_SAVE: {
            ABILITY_STRENGTH: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NON_PROFICIENT_ARMOR_SHIELD,
                HEAVILY_ENCUMBERED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_STRENGTH)
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                NON_PROFICIENT_ARMOR_SHIELD,
                RESTRAINED,
                HEAVILY_ENCUMBERED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_DEXTERITY)
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                HEAVILY_ENCUMBERED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_CONSTITUTION)
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                HEAVILY_ENCUMBERED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_INTELLIGENCE)
            }),
            ABILITY_WISDOM: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                HEAVILY_ENCUMBERED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_WISDOM)
            }),
            ABILITY_CHARISMA: computeRuleValue({
                EXHAUSTION_LEVEL_3,
                HEAVILY_ENCUMBERED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.ABILITY_CHARISMA)
            }),
            THREAT_TYPE_DISEASE: computeRuleValue({
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_DISEASE)
            }),
            THREAT_TYPE_FEAR: computeRuleValue({
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_FEAR)
            }),
            THREAT_TYPE_MIND_SPELL: computeRuleValue({
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_MIND_SPELL)
            }),
            THREAT_TYPE_POISON: computeRuleValue({
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_POISON)
            }),
            THREAT_TYPE_SPELL: computeRuleValue({
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_SPELL)
            }),
            THREAT_TYPE_TRAP: computeRuleValue({
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_TRAP)
            }),
            THREAT_TYPE_DEATH: computeRuleValue({
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_SAVE, CONSTS.THREAT_TYPE_DEATH)
            })
        },
        ROLL_TYPE_CHECK: {
            ABILITY_STRENGTH: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                NON_PROFICIENT_ARMOR_SHIELD,
                POISONED,
                FRIGHTENED,
                HEAVILY_ENCUMBERED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_STRENGTH)
            }),
            ABILITY_DEXTERITY: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                NON_PROFICIENT_ARMOR_SHIELD,
                POISONED,
                FRIGHTENED,
                HEAVILY_ENCUMBERED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_DEXTERITY)
            }),
            ABILITY_CONSTITUTION: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                POISONED,
                FRIGHTENED,
                HEAVILY_ENCUMBERED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_CONSTITUTION)
            }),
            ABILITY_INTELLIGENCE: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                POISONED,
                FRIGHTENED,
                HEAVILY_ENCUMBERED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_INTELLIGENCE)
            }),
            ABILITY_WISDOM: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                POISONED,
                FRIGHTENED,
                HEAVILY_ENCUMBERED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_WISDOM)
            }),
            ABILITY_CHARISMA: computeRuleValue({
                EXHAUSTION_LEVEL_1,
                POISONED,
                FRIGHTENED,
                HEAVILY_ENCUMBERED,
                ...getThoseProvidedByEffects(oDisadvantageEffectRegistry, CONSTS.ROLL_TYPE_CHECK, CONSTS.ABILITY_CHARISMA)
            })
        }
    }
}
