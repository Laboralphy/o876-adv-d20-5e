/**
 * Renvoie la liste des proficiency de la creature
 * @return {string[]}
 */
module.exports = (state, getters, { data }) => {
    const oClassProficiencies = new Set(Object
        .keys(getters.getLevelByClass)
        .map(ref => {
            const sClassName = 'class-' + ref
            if (sClassName in data) {
                return data['class-' + ref].proficiencies
            } else {
                throw new Error('this class has no defined data : ' + sClassName)
            }
        })
        .reduce((prev, curr) => prev.concat(curr), []))
    return [...oClassProficiencies, ...state.proficiencies]
}
