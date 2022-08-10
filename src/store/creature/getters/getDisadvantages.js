const CONSTS = require('../../../consts')

/**
 * Etabli la liste des désavantages
 * @param state
 * @param getters
 * @return {D20AdvantagesOrDisadvantages}
 */
module.exports = (state, getters) => ({
    [CONSTS.ROLL_TYPE_ATTACK] : {
        abilities: {
            [CONSTS.ABILITY_STRENGTH]:
            getters.getExhaustionLevel >= 3 ||
            getters.isProficientArmorAndShield
                ,
                [CONSTS.ABILITY_DEXTERITY]:
            getters.getExhaustionLevel >= 3 ||
            getters.isProficientArmorAndShield
                ,
                [CONSTS.ABILITY_CONSTITUTION]:
            getters.getExhaustionLevel >= 3
                ,
                [CONSTS.ABILITY_INTELLIGENCE]:
            getters.getExhaustionLevel >= 3
                ,
                [CONSTS.ABILITY_WISDOM]:
            getters.getExhaustionLevel >= 3
                ,
                [CONSTS.ABILITY_CHARISMA]:
            getters.getExhaustionLevel >= 3
        }
    },
    [CONSTS.ROLL_TYPE_SAVE] : {
        abilities: {
            [CONSTS.ABILITY_STRENGTH]:
            getters.getExhaustionLevel >= 3 ||
            getters.isProficientArmorAndShield
            ,
            [CONSTS.ABILITY_DEXTERITY]:
            getters.getExhaustionLevel >= 3 ||
            getters.isProficientArmorAndShield
            ,
            [CONSTS.ABILITY_CONSTITUTION]:
            getters.getExhaustionLevel >= 3
            ,
            [CONSTS.ABILITY_INTELLIGENCE]:
            getters.getExhaustionLevel >= 3
            ,
            [CONSTS.ABILITY_WISDOM]:
            getters.getExhaustionLevel >= 3
            ,
            [CONSTS.ABILITY_CHARISMA]:
            getters.getExhaustionLevel >= 3
        },
        threats: {
        }
    },
    [CONSTS.ROLL_TYPE_SKILL] : {
        abilities: {
            [CONSTS.ABILITY_STRENGTH]:
            getters.getExhaustionLevel >= 1 ||
            getters.isProficientArmorAndShield
            ,
            [CONSTS.ABILITY_DEXTERITY]:
            getters.getExhaustionLevel >= 1 ||
            getters.isProficientArmorAndShield
            ,
            [CONSTS.ABILITY_CONSTITUTION]:
            getters.getExhaustionLevel >= 1
            ,
            [CONSTS.ABILITY_INTELLIGENCE]:
            getters.getExhaustionLevel >= 1
            ,
            [CONSTS.ABILITY_WISDOM]:
            getters.getExhaustionLevel >= 1
            ,
            [CONSTS.ABILITY_CHARISMA]:
            getters.getExhaustionLevel >= 1
        },
        skills: {
            [CONSTS.SKILL_STEALTH]:
            getters.isWearingStealthDisadvantagedArmor
        }
    }
})