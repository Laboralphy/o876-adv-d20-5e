/**
 * script : spell-invisibility
 *
 * Octroit l'invisibilité à la cible pendant une 1 heure.
 * L'effet disparait si la créture ciblée attaque ou lance un sort
 * A plus haut niveau : on peut rendre invisible une cible supplémentaire
 */

const CONSTS = require('../../../consts')

function applyInvisibilityTo (target, oSpellCast) {
    const eInvis = oSpellCast.createSpellEffect(CONSTS.EFFECT_INVISIBILITY)
    const nDuration = oSpellCast.getDurationHours(1)
    oSpellCast.applyEffectToTarget(eInvis, nDuration, target)
}

module.exports = oSpellCast => {
    const nAdditionnalTargets = oSpellCast.power
    applyInvisibilityTo(oSpellCast.target)
    oSpellCast
        .friends
        .slice(0, nAdditionnalTargets)
        .forEach(t => {
            applyInvisibilityTo(oSpellCast.target)
        })
    oSpellCast.concentrate()
}
