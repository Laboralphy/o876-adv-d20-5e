/**
 * script spell-burning-hands
 *
 * Niveau 1 evocation
 * Cône de 15 pieds
 * Ce sort crame la gueule d'un certain nombre de créatures (1d3) hostiles au lanceur de sort
 * Le sort étale sa zone d'effet en forme de cône.
 * il fait 3d6 de dégât de feu +1d6 par slot supplémentaire
 * @date 2023-12-26
 * @author ralphy
 */

const SpellHelper = require('../../classic/common/spell-helper')
const CONSTS = require('../../../consts')

module.exports = oSpellCast => {
    const nDice = oSpellCast.power + 3
    const sDice = nDice + 'd6'
    const caster = oSpellCast.caster
    oSpellCast.evocationAttack({
        damage: oSpellCast.rollCasterDamageDice(sDice),
        type: CONSTS.DAMAGE_TYPE_FIRE
    })
    SpellHelper.chooseRandomItems(
        oSpellCast.hostiles.filter(h => h !== oSpellCast.target),
        caster.roll('1d3-1')
    ).forEach(h => {
        oSpellCast.evocationAttack({
            target: h,
            damage: oSpellCast.rollCasterDamageDice(sDice),
            type: CONSTS.DAMAGE_TYPE_FIRE
        })
    })
}