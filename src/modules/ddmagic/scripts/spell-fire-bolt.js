/**
 * script spell-fire-bolt
 *
 * Niveau 0 Evocation
 * Attaque à distance (projectile visé) / pas de jet de sauvegarde
 * Lance une boulette de feu dans la tronch de la cible occasionnant des dégâts de feu
 * niv 1 -> 1d10 ; niv 5 -> 2d10 ; niv 11 -> 3d10 ; niv 17 -> 4d10
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
            oSpellCast.caster.roll(oSpellCast.getCantripDamageDice(10)),
            CONSTS.DAMAGE_TYPE_FIRE
        )
        oSpellCast.applyEffectToTarget(eDam)
    }
}
