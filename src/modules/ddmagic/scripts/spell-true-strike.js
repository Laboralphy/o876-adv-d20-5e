/**
 * script spell-true-strike
 *
 * Niveau 0 divination
 * Octroit un avantage à la prochaine attaque.
 * @date 2023-11-24
 * @author ralphy
 */

const CONSTS = require('../../../consts')

const SUPPORTED_ABILITIES = [
    CONSTS.ABILITY_STRENGTH,
    CONSTS.ABILITY_DEXTERITY,
    CONSTS.ABILITY_CONSTITUTION,
    CONSTS.ABILITY_INTELLIGENCE,
    CONSTS.ABILITY_WISDOM,
    CONSTS.ABILITY_CHARISMA
]

const SUPPORTED_ROLL_TYPES = [CONSTS.ROLL_TYPE_ATTACK]

/**
 * @param oSpellCast {SpellCast}
 */
module.exports = (oSpellCast) => {
    const eTS = oSpellCast.createSpellEffect(
        CONSTS.EFFECT_ADVANTAGE,
        SUPPORTED_ABILITIES,
        SUPPORTED_ROLL_TYPES,
        oSpellCast.spell
    )
    const eEndOnAttack = oSpellCast.createSpellEffect(
        CONSTS.EFFECT_END_ON_ATTACK,
        eTS
    )
    oSpellCast.applyEffectToCaster(eTS, 2)
    oSpellCast.applyEffectToCaster(eEndOnAttack, oSpellCast.getDurationHours(1))
    oSpellCast.concentrate()
}
