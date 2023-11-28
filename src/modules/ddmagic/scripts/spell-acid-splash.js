/**
 * script spell-acid-splash
 *
 * Niveau 0 conjuration
 * Sauvegarde : dex / annule dégâts
 * Projectile autoguidé
 * Lancement du sort acid splash qui va projeter un globe d'acide sur deux cibles
 * Le globe fait 1d6 de dégât d'acide, +1d6 niv 5 +1d6 niv 11 +1d6 niv 17
 * @date 2023-11-24
 * @author ralphy
 */

const SpellHelper = require('../../classic/common/spell-helper')
const DDMagicSpellHelper = require('../common/ddmagic-specific-spell-helper')
const CONSTS = require('../../../consts')

/**
 * @param caster {Creature}
 * @param power {number}
 * @param hostiles {Creature[]}
 * @param parameters {{}}
 */
module.exports = ({ caster, hostiles }) => {
    // déterminer un voisin de la cible
    const oTarget = caster.getTarget()
    splashAcid(oTarget, caster)
    const oAdditionalTarget = SpellHelper
        .chooseRandomItems(hostiles.filter(h => h !== oTarget), 1)
        .shift()
    if (oAdditionalTarget) {
        splashAcid(oAdditionalTarget, caster)
    }
}

function splashAcid (target, caster) {
    DDMagicSpellHelper.declareSpellEffects({
        spell: 'acid-splash',
        effects: [
            SpellHelper.evocationAttack({
                caster,
                target,
                damage: caster.roll(DDMagicSpellHelper.getCantripDamageDice(caster, 6)),
                type: CONSTS.DAMAGE_TYPE_ACID,
                dc: caster.store.getters.getSpellDC,
                cantrip: true
            })
        ],
        caster,
        target
    })
}
