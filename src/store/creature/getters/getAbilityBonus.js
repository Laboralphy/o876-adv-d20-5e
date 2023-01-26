const CONSTS = require('../../../consts')

/**
 * Registre associant les caractéristiques et leur bonus
 * @param state
 * @param getters
 * @returns {D20AbilityNumberRegistry}
 */
module.exports = (state, getters) => {
    const r = {
        [CONSTS.ABILITY_STRENGTH]: 0,
        [CONSTS.ABILITY_DEXTERITY]: 0,
        [CONSTS.ABILITY_CONSTITUTION]: 0,
        [CONSTS.ABILITY_INTELLIGENCE]: 0,
        [CONSTS.ABILITY_WISDOM]: 0,
        [CONSTS.ABILITY_CHARISMA]: 0
    }
    getters
        .getEffects
        .forEach(eff => {
            if (eff.type === CONSTS.EFFECT_ABILITY_BONUS) {
                r[eff.data.ability] += eff.amp
            }
        })
    getters
        .getEquipmentItemProperties
        .forEach(ip => {
            if (ip.property === CONSTS.EFFECT_ABILITY_BONUS) {
                r[ip.ability] += ip.amp
            }
        })
    return r
}
