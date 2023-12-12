/**
 * script spell-zap (remplace shocking-grasp)
 *
 * Niveau 0 Evocation
 * Attaque à distance (projectile autoguidé) / jet de sauvegarde dex
 * Lance un éclair qui frappe la cible et l'étourdi, les dégâts dépendent du niveau du lanceur de sort
 * niv 1 -> 1d6 ; niv 5 -> 2d6 ; niv 11 -> 3d6 ; niv 17 -> 4d6
 * si la cible réussi son jet de sauvegarde, Les dégâts sont réduit de moitié, et l'effet d'étourdissement est annulé
 * @date 2023-11-30
 * @author ralphy
 */

const CONSTS = require('../../../consts')

/**
 * @param oSpellCast {SpellCast}
 */
module.exports = (oSpellCast) => {
    const eDam = oSpellCast.evocationAttack({
        damage: oSpellCast.caster.roll(oSpellCast.getCantripDamageDice(6)),
        type: CONSTS.DAMAGE_TYPE_ELECTRICITY
    })
    if (!!eDam && !eDam.data.savingThrowSuccess) {
        const eStunned = oSpellCast.createSpellEffect(CONSTS.EFFECT_CONDITION, CONSTS.CONDITION_STUNNED)
        oSpellCast.applyEffectToTarget(eStunned, 2, oSpellCast.target)
    }
}
