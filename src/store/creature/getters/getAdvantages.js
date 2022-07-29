const CONSTS = require('../../../consts')
/**
 * Etabli la lsite des désavantages
 * @param state
 * @param getters
 */

module.exports = (state, getters) => ({
    [CONSTS.ROLL_TYPE_ATTACK] : {
        [CONSTS.ABILITY_STRENGTH]: false,
        [CONSTS.ABILITY_DEXTERITY]: false,
        [CONSTS.ABILITY_CONSTITUTION]: false,
        [CONSTS.ABILITY_INTELLIGENCE]: false,
        [CONSTS.ABILITY_WISDOM]: false,
        [CONSTS.ABILITY_CHARISMA]: false,
    },
    [CONSTS.ROLL_TYPE_SAVE] : {
        [CONSTS.ABILITY_STRENGTH]: false,
        [CONSTS.ABILITY_DEXTERITY]: false,
        [CONSTS.ABILITY_CONSTITUTION]: false,
        [CONSTS.ABILITY_INTELLIGENCE]: false,
        [CONSTS.ABILITY_WISDOM]: false,
        [CONSTS.ABILITY_CHARISMA]: false,
    },
    [CONSTS.ROLL_TYPE_SKILL] : {
        [CONSTS.ABILITY_STRENGTH]: false,
        [CONSTS.ABILITY_DEXTERITY]: false,
        [CONSTS.ABILITY_CONSTITUTION]: false,
        [CONSTS.ABILITY_INTELLIGENCE]: false,
        [CONSTS.ABILITY_WISDOM]: false,
        [CONSTS.ABILITY_CHARISMA]: false,
    }
})