/**
 * script spell-burning-hands
 *
 * Ce sort crame la gueule de tous les ennemis (3) hostile au lanceur de sort
 * Le sort étale sa zone d'effet en forme de cône.
 * il fait 3d6 de dégât de feu +1d6 par slot supplémentaire
 */

const SpellHelper = require('../../classic/common/spell-helper')
const CONSTS = require('../../../consts')

module.exports = oSpellCast => {
    const nDice = oSpellCast.power + 3
    const sDice = nDice + 'd6'
    const caster = oSpellCast.caster
    oSpellCast.evocationAttack({
        damage: caster.roll(sDice),
        type: CONSTS.DAMAGE_TYPE_FIRE
    })
    SpellHelper.chooseRandomItems(
        oSpellCast.hostiles.filter(h => h !== oSpellCast.target),
        caster.roll('1d3')
    ).forEach(h => {
        oSpellCast.evocationAttack({
            target: h,
            damage: caster.roll(sDice),
            type: CONSTS.DAMAGE_TYPE_FIRE
        })
    })
}