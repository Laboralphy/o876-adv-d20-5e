/**
 * script spell-poison-spray
 *
 * Niveau 0 conjuration
 * Sauvegarde : constitution / annule dégâts
 * Projectile autoguidé
 * Lancement du sort poison spray qui va projeter un globe explosant en un nuage de poison
 * Le nuage fait 1d12 de dégât d'acide, +1d12 niv 5 +1d12 niv 11 +1d12 niv 17
 * @date 2023-11-24
 * @author ralphy
 */

const SpellHelper = require('../../classic/common/spell-helper')
const DDMagicSpellHelper = require('../common/ddmagic-specific-spell-helper')
const CONSTS = require('../../../consts')

/**
 * @param caster {Creature}
 * @param power {number}
 */
module.exports = ({ caster }) => {
    // déterminer un voisin de la cible
    const oTarget = caster.getTarget()
    SpellHelper.evocationAttack({
        caster,
        target: oTarget,
        damage: caster.roll(DDMagicSpellHelper.getCantripDamageDice(caster, 12)),
        type: CONSTS.DAMAGE_TYPE_POISON,
        dc: caster.store.getters.getSpellDC,
        ability: CONSTS.ABILITY_CONSTITUTION,
        cantrip: true
    })
}
