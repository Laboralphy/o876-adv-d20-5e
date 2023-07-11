const CONSTS = require('../../../consts')
const EffectProcessor = require('../../../EffectProcessor')

/**
 * Pattern de sortilège.
 * Applique une condition à la cible si celle-ci rate son jet de sauvegarde
 * @param caster {Creature} creature qui lance le sort
 * @param target {Creature} creature ciblée par le sort
 * @param condition {string} condition appliquée si le sort réussi
 * @param duration {number} durée de la condition
 * @param savingAbility {string} caractéristique utilisée pour le jet de sauvegarde
 * @param [threats] {string[]} liste optionnel des menace qui peuvent influencer le jet de sauvegarde
 * @param dc {number} difficulté du jet de sauvegarde
 * @param subtype {string} sous type de l'effet
 */
function conditionAttack ({
                              caster,
                              target,
                              condition,
                              duration,
                              savingAbility,
                              threats = [],
                              dc,
                              subtype = CONSTS.EFFECT_SUBTYPE_MAGICAL
                          }) {
    const { success } = target.rollSavingThrow(savingAbility, [CONSTS.THREAT_TYPE_SPELL, ...threats], dc)
    if (!success) {
        const eCond = EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, condition)
        eCond.subtype = subtype
        return target.applyEffect(eCond, duration, caster)
    } else {
        return null
    }
}


/**
 * Pattern de sortilège.
 * Effectue une attaque d'évocation typique : une attaque qui touche automatiquement la cible
 * Avec possibilité de jet de sauvegarde basé sur la dextérité
 * Si le jet de sauvegarde échoue, la totalité des dégâts spécifés est appliquée sinon, la moitié seulement est appliquée
 * @param caster {Creature} creature qui lance le sort
 * @param target {Creature} creature ciblée par le sort
 * @param damage {number} quantité de dégât
 * @param sType {string} type de dégâts (DAMAGE_TYPE_*)
 * @param dc {number} difficulté du jet de sauvegarde
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