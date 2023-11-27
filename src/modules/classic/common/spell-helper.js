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
 * @param [threats] {string[]} liste optionnel des menaces qui peuvent influencer le jet de sauvegarde
 * @param dc {number} difficulté du jet de sauvegarde
 * @param subtype {string} sous type de l'effet
 * @return {D20Effect}
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
    const { success } = target.rollSavingThrow(savingAbility, [CONSTS.THREAT_TYPE_SPELL, ...threats], dc, caster)
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
 * Si la cible a le feat Evasion, on applique une reduction de dégât supplémentaire
 * @param caster {Creature} creature qui lance le sort
 * @param target {Creature} creature ciblée par le sort
 * @param damage {number} quantité de dégât
 * @param sType {string} type de dégâts (DAMAGE_TYPE_*)
 * @param dc {number} difficulté du jet de sauvegarde
 * @param cantrip {boolean}
 * @return {D20Effect}
 */
function evocationAttack ({
    caster,
    target,
    damage,
    type: sType,
    dc,
    cantrip = false
}) {
    const { success } = target.rollSavingThrow(CONSTS.ABILITY_DEXTERITY, [CONSTS.THREAT_TYPE_SPELL], dc, caster)
    const bHasEvasion = target.aggregateModifiers([CONSTS.EFFECT_EVASION], {}).count > 0
    const nCase = (bHasEvasion ? 10 : 0) + (success ? 1 : 0)
    switch (nCase) {
        case 11: {
            damage = 0
            break
        }

        case 10:
        case 1: {
            if (cantrip) {
                damage = 0
            } else {
                damage >>= 1
            }
            break
        }
    }
    const eDam = EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, damage, sType)
    return target.applyEffect(eDam, 0, caster)
}

/**
 * Choisi nCount éléments au hasard dans la liste spécifiée
 * @param aArray {[]}
 * @param nCount {number}
 * @returns {[]}
 */
function chooseRandomItems (aArray, nCount) {
    if (aArray.length === 0) {
        return aArray
    }
    if (nCount >= aArray.length) {
        return aArray
    }
    const iChoice = Math.floor(Math.random() * aArray.length)
    const aRemainers = aArray.filter((x, i) => i !== iChoice)
    return [aArray[iChoice], ...chooseRandomItems(aRemainers, nCount - 1)]
}

module.exports = {
    conditionAttack,
    evocationAttack,
    chooseRandomItems
}
