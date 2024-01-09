/**
 * script spell-acid-splash
 *
 * Niveau 0 conjuration
 * Projectile autoguidé // Sauvegarde : dex / annule dégâts
 * Lancement du sort acid splash qui va projeter un globe d'acide sur deux cibles
 * Le globe fait 1d6 de dégât d'acide, +1d6 niv 5 +1d6 niv 11 +1d6 niv 17
 * @date 2023-11-24
 * @author ralphy
 */

const SpellHelper = require('../../classic/common/spell-helper')
const CONSTS = require('../../../consts')

/**
 * @param oSpellCast {SpellCast}
 */
module.exports = (oSpellCast) => {
    oSpellCast.evocationAttack({
        damage: oSpellCast.rollCasterDamageDice(oSpellCast.getCantripDamageDice(6)),
        type: CONSTS.DAMAGE_TYPE_ACID,
    })
    const oAdditionalTarget = SpellHelper
        .chooseRandomItems(oSpellCast.hostiles.filter(h => h !== oSpellCast.target), 1)
        .shift()
    if (oAdditionalTarget) {
        oSpellCast.evocationAttack({
            damage: oSpellCast.rollCasterDamageDice(oSpellCast.getCantripDamageDice(6)),
            type: CONSTS.DAMAGE_TYPE_ACID,
            target: oAdditionalTarget
        })
    }
}
