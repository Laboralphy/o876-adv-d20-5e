const CONSTS = require('../../../consts')
const EffectProcessor = require('../../../EffectProcessor')

/**
 * Pattern de sortilège.
 * Effectue une attaque d'évocation typique : une attaque qui touche automatiquement la cible
 * Avec possibilité de jet de sauvegarde basé sur la dextérité
 * Si le jet de sauvegarde échoue, la totalité des dégâts spécifés est appliquée sinon, la moitié seulement est appliquée
 * @param caster
 * @param target
 * @param damage
 * @param sType
 * @param dc
 */
function evocationAttack ({
    caster,
    target,
    damage,
    type: sType,
    dc
}) {
    const { success } = target.rollSavingThrow(CONSTS.ABILITY_DEXTERITY, [CONSTS.THREAT_TYPE_SPELL], dc)
    if (success) {
        damage = damage >> 1
    }
    const eDam = EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, damage, sType)
    target.applyEffect(eDam, 0, caster)
}

module.exports = {
    evocationAttack
}