/**
 * Renvoie la liste des proficiency de la creature
 * @return {string[]}
 */
module.exports = (state, getters, { data }) => {
    const aClasses = getters.getClassList
    const oClassProficiencies = new Set(
        aClasses
        .map((ref, i) => {
            const sClassName = 'class-' + ref
            if (sClassName in data) {
                const cr = data['class-' + ref]
                return (i !== 0 && 'multiclass' in cr)
                    ? (cr.multiclass.proficiencies || [])
                    : cr.proficiencies
            } else {
                throw new Error('this class has no defined data : ' + sClassName)
            }
        })
        .reduce((prev, curr) => prev.concat(curr), []))
    return [...oClassProficiencies, ...state.proficiencies]
}
