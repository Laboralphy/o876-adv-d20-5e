/**
 * The character level, obtained by adding all levels in each class
 * @param state
 * @returns {number}
 */
module.exports = state => {
    const oClasses = {}
    state.classes.forEach(({ ref, levels }) => {
        if (ref in oClasses) {
            throw new Error('duplicated class "' + ref + '"')
        } else {
            oClasses[ref] = levels
        }
    })
    return oClasses
}
