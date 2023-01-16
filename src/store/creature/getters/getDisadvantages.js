/**
 * Etabli la liste des désavantages
 * @param state
 * @param getters
 * @return {D20AdvantagesOrDisadvantages}
 */
module.exports = (state, getters) => {
    const exhaustionLevel3 = getters.getExhaustionLevel >= 3
    const exhaustionLevel1 = getters.getExhaustionLevel >= 1
    const nonProficientArmorShield = !getters.isProficientArmorAndShield
    const wearingNonStealthArmor = getters.isWearingStealthDisadvantagedArmor
    const targetInvisible = !getters.canSeeTarget
    return {
        ROLL_TYPE_ATTACK: {
            abilities: {
                ABILITY_STRENGTH: exhaustionLevel3 || nonProficientArmorShield || targetInvisible,
                    ABILITY_DEXTERITY: exhaustionLevel3 || nonProficientArmorShield || targetInvisible,
                    ABILITY_CONSTITUTION: exhaustionLevel3 || targetInvisible,
                    ABILITY_INTELLIGENCE: exhaustionLevel3 || targetInvisible,
                    ABILITY_WISDOM: exhaustionLevel3 || targetInvisible,
                    ABILITY_CHARISMA: exhaustionLevel3 || targetInvisible
            }
        },
        ROLL_TYPE_SAVE: {
            abilities: {
                ABILITY_STRENGTH: exhaustionLevel3 || nonProficientArmorShield,
                    ABILITY_DEXTERITY: exhaustionLevel3 || nonProficientArmorShield,
                    ABILITY_CONSTITUTION: exhaustionLevel3,
                    ABILITY_INTELLIGENCE: exhaustionLevel3,
                    ABILITY_WISDOM: exhaustionLevel3,
                    ABILITY_CHARISMA: exhaustionLevel3
            },
            threats: {
            }
        },
        ROLL_TYPE_SKILL: {
            abilities: {
                ABILITY_STRENGTH: exhaustionLevel1 || nonProficientArmorShield,
                    ABILITY_DEXTERITY: exhaustionLevel1 || nonProficientArmorShield,
                    ABILITY_CONSTITUTION: exhaustionLevel1,
                    ABILITY_INTELLIGENCE: exhaustionLevel1,
                    ABILITY_WISDOM: exhaustionLevel1,
                    ABILITY_CHARISMA: exhaustionLevel1
            },
            skills: {
                SKILL_STEALTH: wearingNonStealthArmor
            }
        }
    }
}