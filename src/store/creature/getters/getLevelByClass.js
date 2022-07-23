/**
 * The character level, obtained by adding all levels in each class
 * @param state
 * @returns {number}
 */
module.exports = state => {
    const oClasses = {}
    state.classes.forEach(({ name, levels }) => {
        if (name in oClasses) {
            throw new Error('duplicated class "' + name + '"')
        } else {
            oClasses[name] = levels
        }
    })
    return oClasses
}
