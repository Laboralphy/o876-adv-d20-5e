const CONSTS = require('../../../consts')
/**
 * Etabli la liste des désavantages
 * @param state
 * @param getters
 */

module.exports = (state, getters) => ({
    [CONSTS.ROLL_TYPE_ATTACK] : {
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
    [CONSTS.ROLL_TYPE_SAVE] : {
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
    [CONSTS.ROLL_TYPE_SKILL] : {
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
    }
})