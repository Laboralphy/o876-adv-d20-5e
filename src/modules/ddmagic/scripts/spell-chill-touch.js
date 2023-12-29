/**
 * script spell-chill-touch
 *
 * Niveau 0 Nécromancie
 * Attaque à distance (projectile visé) / pas de jet de sauvegarde
 * Le sort jette une main squelettique à la gorge de la cible
 * occasionnant des dégâts nécrotique en fonction du niveau de lanceur de sort
 * niv 1 -> 1d8 ; niv 5 -> 2d8 ; niv 11 -> 3d8 ; niv 17 -> 4d8
 * La cible touchée ne peut pas être soignée pendant 2 tours
 * Si la cible est un mort-vivant, elle est désavantagée pour des attaques, lors des deux prochains tours
 * @date 2023-12-26
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
            oSpellCast.rollCasterDamageDice(oSpellCast.getCantripDamageDice(8)),
            CONSTS.DAMAGE_TYPE_NECROTIC
        )
        const eNoHeal = oSpellCast.createSpellEffect(
            CONSTS.EFFECT_MUMMY_ROT
        )
        oSpellCast.applyEffectToTarget(eDam)
        oSpellCast.applyEffectToTarget(eNoHeal, 2)
        if (oSpellCast.target.store.getters.getSpecie === CONSTS.SPECIE_UNDEAD) {
            const eDisAttack = oSpellCast.createSpellEffect(
                CONSTS.EFFECT_DISADVANTAGE,
                CONSTS.ROLL_TYPE_ATTACK,
                [
                    CONSTS.ABILITY_STRENGTH,
                    CONSTS.ABILITY_DEXTERITY,
                    CONSTS.ABILITY_CONSTITUTION,
                    CONSTS.ABILITY_INTELLIGENCE,
                    CONSTS.ABILITY_WISDOM,
                    CONSTS.ABILITY_CHARISMA
                ]
            )
            oSpellCast.applyEffectToTarget(eDisAttack, 2)
        }
    }
}
