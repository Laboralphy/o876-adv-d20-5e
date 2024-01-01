function truncateArray (a) {
    a.splice(0, a.length)
}
/**
 * Supprime les classes, proficiencies, skills, extra attacks, et feats d'un personnage
 * Le personnage retourne au niveau 0 et doit choisir une nouvelle classe.
 */

module.exports = ({ state }) => {
    truncateArray(state.proficiencies)
    truncateArray(state.classes)
    truncateArray(state.feats)
    state.counters.extraAttacks.value = 0
}