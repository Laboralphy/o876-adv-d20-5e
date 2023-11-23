function truncateArray (a) {
    a.splice(0, a.length)
}
/**
 * Supprime les classes, proficiencies, skills, extra attacks, et feats d'un personnage
 * Le personnage retourne au niveau 0 et dois choisir une nouvelle classe.
 */

module.exports = ({ state }) => {
    truncateArray(state.proficiencies)
    truncateArray(state.classes)
    truncateArray(state.feats)
    state.counters.extraAttacks = 0
}