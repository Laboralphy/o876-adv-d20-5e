const SpellHelper = require('../../classic/common/spell-helper')
const CONSTS = require('../../../consts')

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
 *
 * @param caster {Creature}
 * @param power {number}
 * @param parameters {SpellCastingParameters}
 */
module.exports = ({ caster, power, parameters }) => {
    // déterminer un voisin de la cible
    const { hostiles } = parameters
    const oTarget = caster.getTarget()
    splashAcid(oTarget, caster)
    const oAdditionalTarget = SpellHelper
        .chooseRandomItems(hostiles.filter(h => h !== oTarget), 1)
        .shift()
    if (oAdditionalTarget) {
        splashAcid(oAdditionalTarget, caster)
    }
}

function getDamage (caster) {
    const nCasterLevel = caster.store.getters.getWizardLevel
    if (nCasterLevel >= 17) {
        return '4d6'
    } else if (nCasterLevel >= 11) {
        return '3d6'
    } else if (nCasterLevel >= 5) {
        return '2d6'
    } else {
        return '1d6'
    }
}

function splashAcid (target, caster) {
    SpellHelper.evocationAttack({
        caster,
        target,
        damage: caster.roll(getDamage(caster)),
        type: CONSTS.DAMAGE_TYPE_ACID,
        dc: caster.store.getters.getSpellDC,
        cantrip: true
    })
}
