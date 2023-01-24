/**
 * Renvoie la liste des proficiency de la creature
 * @return {string[]}
 */
module.exports = (state, getters, { data }) => {
    const oClassProficiencies = new Set(Object
        .keys(getters.getLevelByClass)
        .map(c => data['class-' + c].proficiencies)
        .reduce((prev, curr) => prev.concat(curr), []))
    return [...oClassProficiencies]
}
