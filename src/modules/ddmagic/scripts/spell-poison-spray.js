/**
 * script spell-poison-spray
 *
 * Niveau 0 conjuration
 * Projectile autoguidé ; Sauvegarde : constitution / annule dégâts
 * Lancement du sort poison spray qui va projeter un globe explosant en un nuage de poison
 * Le nuage fait 1d12 de dégât d'acide, +1d12 niv 5 +1d12 niv 11 +1d12 niv 17
 * @date 2023-11-24
 * @author ralphy
 */

const CONSTS = require('../../../consts')

/**
 * @param oSpellCast {SpellCast}
 */
module.exports = (oSpellCast) => {
    const eDam = oSpellCast.evocationAttack({
        damage: oSpellCast.caster.roll(oSpellCast.getCantripDamageDice(12)),
        type: CONSTS.DAMAGE_TYPE_POISON,
        ability: CONSTS.ABILITY_CONSTITUTION
    })
}
