/**
 * script spell-ray-of-frost
 *
 * Niveau 0 evocation
 * Attaque à distance - Rayon visé / pas de sauvegarde
 * Lance un rayon glacé qui frappe la cible occasionnant des dégâts de glace en fonction du niveau et qui ralenti
 * la vitesse de déplacement de la cible
 * niv 1 -> 1d10 ; niv 5 -> 2d10 ; niv 11 -> 3d10 ; niv 17 -> 4d10
 * @date 2023-11-28
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
            oSpellCast.rollCasterDamageDice(oSpellCast.getCantripDamageDice(10)),
            CONSTS.DAMAGE_TYPE_COLD
        )
        const eSlow = oSpellCast.createSpellEffect(
            CONSTS.EFFECT_SPEED_BONUS,
            -10,
        )
        oSpellCast.applyEffectToTarget(eDam)
        oSpellCast.applyEffectToTarget(eSlow, 2)
    }
}
