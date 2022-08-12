const CONSTS = require('../../../consts')
/**
 * Etabli la liste des désavantages
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @return {D20AdvantagesOrDisadvantages}
 */

module.exports = (state, getters) => ({
    [CONSTS.ROLL_TYPE_ATTACK] : {
        ability: {
            [CONSTS.ABILITY_STRENGTH]: false,
            [CONSTS.ABILITY_DEXTERITY]: false,
            [CONSTS.ABILITY_CONSTITUTION]: false,
            [CONSTS.ABILITY_INTELLIGENCE]: false,
            [CONSTS.ABILITY_WISDOM]: false,
            [CONSTS.ABILITY_CHARISMA]: false
        }
    },
    [CONSTS.ROLL_TYPE_SAVE] : {
        abilities: {
            [CONSTS.ABILITY_STRENGTH]: false,
            [CONSTS.ABILITY_DEXTERITY]: false,
            [CONSTS.ABILITY_CONSTITUTION]: false,
            [CONSTS.ABILITY_INTELLIGENCE]: false,
            [CONSTS.ABILITY_WISDOM]: false,
            [CONSTS.ABILITY_CHARISMA]: false
        },
        threats: {
        }
    },
    [CONSTS.ROLL_TYPE_SKILL] : {
        abilities: {
            [CONSTS.ABILITY_STRENGTH]: false,
            [CONSTS.ABILITY_DEXTERITY]: false,
            [CONSTS.ABILITY_CONSTITUTION]: false,
            [CONSTS.ABILITY_INTELLIGENCE]: false,
            [CONSTS.ABILITY_WISDOM]: false,
            [CONSTS.ABILITY_CHARISMA]: false
        },
        skills: {
            [CONSTS.SKILL_STEALTH]: false
        }
    }
})
