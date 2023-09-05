/**
 * Renvoie la liste des classes dans l'ordre de l'évolution du personnage
 * @param state
 * @returns {string[]}
 */
module.exports = state => {
    const aClasses = []
    state.classes.forEach(({ ref }) => {
        if (!aClasses.includes(ref)) {
            aClasses.push(ref)
        }
    })
    return aClasses
}