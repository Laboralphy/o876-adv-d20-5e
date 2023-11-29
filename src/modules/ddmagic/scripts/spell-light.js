/**
 * script spell-light
 *
 * Niveau 0 evocation
 * Illumine les alentours.
 * @date 2023-11-24
 * @author ralphy
 */
const CONSTS = require('../../../consts')

/**
 * @param oSpellCast {SpellCast}
 */
module.exports = (oSpellCast) => {
    const eLight = oSpellCast.createSpellEffect(
        CONSTS.EFFECT_LIGHT
    )
    oSpellCast.applyEffectToCaster(eLight, oSpellCast.getDurationHours(1))
}
