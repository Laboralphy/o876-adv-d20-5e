const CONSTS = require('../../../consts')
const EffectProcessor = require('../../../EffectProcessor')

/**
 * Pattern de sortilège.
 * Applique une condition à la cible si celle-ci rate son jet de sauvegarde
 * @param caster
 * @param target
 * @param condition {string}
 * @param duration {string}
 * @param savingAbility {string}
 * @param [threats] {string[]}
 * @param dc
 */
function conditionAttack ({
                              caster,
                              target,
                              condition,
                              duration,
                              savingAbility,
                              threats = [],
                              dc
                          }) {
    const { success } = target.rollSavingThrow(savingAbility, [CONSTS.THREAT_TYPE_SPELL, ...threats], dc)
    if (success) {
        const eCond = EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, 0, condition)
        target.applyEffect(eCond, duration, caster)
    }
}


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
    conditionAttack,
    evocationAttack
}