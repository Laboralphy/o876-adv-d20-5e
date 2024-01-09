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
 * @param apply {boolean} si true alors applique l'effet
 * @return {D20Effect|null}
 */
function conditionAttack ({
    caster,
    target,
    condition,
    duration = 0,
    savingAbility,
    threats = [],
    dc,
    subtype = CONSTS.EFFECT_SUBTYPE_MAGICAL,
    apply = false
}) {
    const { success } = savingAbility === ''
        ? { success: true }
        : target.rollSavingThrow(savingAbility, [CONSTS.THREAT_TYPE_SPELL, ...threats], dc, caster)
    if (!success) {
        const eCond = EffectProcessor.createEffect(CONSTS.EFFECT_CONDITION, condition)
        eCond.subtype = subtype
        eCond.data.savingThrowSuccess = success
        return apply ? target.applyEffect(eCond, duration, caster) : eCond
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
 * @param ability {string} caracteristique utilisée pour le jet de sauvegarde
 * @param apply {boolean} si true alors on applique l'effet
 * @return {D20Effect|null}
 */
function evocationAttack ({
    caster,
    target,
    damage,
    type: sType,
    dc,
    cantrip = false,
    ability = CONSTS.ABILITY_DEXTERITY,
    apply = false
}) {
    let nDamage = damage
    const { success } = target.rollSavingThrow(ability, [CONSTS.THREAT_TYPE_SPELL], dc, caster)
    const isDexterityBased = ability === CONSTS.ABILITY_DEXTERITY
    const bHasEvasion =
        isDexterityBased &&
        target.aggregateModifiers([CONSTS.EFFECT_EVASION], {}).count > 0
    const nCase = (cantrip ? 1000 : 0) + (isDexterityBased ? 100 : 0) + (bHasEvasion ? 10 : 0) + (success ? 1 : 0)
    switch (nCase) {
        case 0: {
            // sort normal, non dex, non évasion, js raté
            // pas de changement dans les dégâts
            break
        }

        case 1: {
            // sort normal, non dex, non évasion, js réussi
            // reduction des dégats
            nDamage >>= 1
            break
        }

        case 10: {
            // sort normal, non dex, evasion, js raté
            // pas de changement de dégâts
            break
        }

        case 11: {
            // sort normal, non dex, evasion, js réussi
            // reduction des dégâts
            nDamage >>= 1
            break
        }

        case 100: {
            // sort normal, dex, pas d'évasion, js raté
            // pas de changement des dégâts
            break
        }

        case 101: {
            // sort normal, dex, pas d'évasion, js réussi
            // réduction des dégâts
            nDamage >>= 1
            break
        }

        case 110: {
            // sort normal, dex, évasion, js raté
            // reduction des dégâts quand même
            nDamage >>= 1
            break
        }

        case 111: {
            // sort normal, dex, évasion, js réussi
            // annulation des dégâts
            nDamage = 0
            break
        }

        case 1000: {
            // cantrip, non-dex, pas d'évasion, js raté
            // pas de changement des dégâts
            break
        }

        case 1001: {
            // cantrip, non-dex, pas d'évasion, js réussi
            // annulation des dégâts
            nDamage = 0
            break
        }

        case 1010: {
            // cantrip, non-dex, évasion, js raté
            // dégât réduits
            nDamage >>= 1
            break
        }

        case 1011: {
            // cantrip, non-dex, évasion, js réussi
            // annulation des dégâts
            nDamage = 0
            break
        }

        case 1100: {
            // cantrip, dex, pas d'évasion, js raté
            // pas de changement des dégâts
            break
        }

        case 1101: {
            // cantrip, dex, pas d'évasion, js réussi
            // annulation des dégâts
            nDamage = 0
            break
        }

        case 1110: {
            // cantrip, dex, évasion, js raté
            // réduction des dégâts
            nDamage >>= 1
            break
        }

        case 1111: {
            // cantrip, dex, évasion, js réussi
            // annulation des dégâts
            nDamage = 0
            break
        }
    }
    if (nDamage > 0) {
        const eDam = EffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, nDamage, sType)
        eDam.data.savingThrowSuccess = success
        return apply ? target.applyEffect(eDam, 0, caster) : eDam
    } else {
        return null
    }
}

/**
 * Choisi nCount éléments au hasard dans la liste spécifiée
 * @param aArray {[]}
 * @param nCount {number}
 * @returns {[]}
 */
function chooseRandomItems (aArray, nCount) {
    if (aArray.length === 0 || nCount >= aArray.length) {
        return aArray
    }
    if (nCount === 0) {
        return []
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
