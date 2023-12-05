/**
 * script spell-chill-touch
 *
 * Niveau 0 Nécromancie
 * Attaque à distance (projectile visé) / pas de jet de sauvegarde
 * Le sort jette une main squelettique à la gorge de la cible
 * occasionnant des dégâts nécrotique ne fonction du niveau de lanceur de sort
 * niv 1 -> 1d8 ; niv 5 -> 2d8 ; niv 11 -> 3d8 ; niv 17 -> 4d8
 * @date 2023-11-29
 * @author ralphy
 */

const CONSTS = require('../../../consts')

/**
 * @param oSpellCast {SpellCast}
 */
module.exports = (oSpellCast) => {
    if (oSpellCast.rangedAttack().hit) {
        const eDam = oSpellCast.createSpellEffect(
            CONSTS.EFFECT_DAMAGE,
            oSpellCast.caster.roll(oSpellCast.getCantripDamageDice(8)),
            CONSTS.DAMAGE_TYPE_NECROTIC
        )
        oSpellCast.applyEffectToTarget(eDam)
    }
}
