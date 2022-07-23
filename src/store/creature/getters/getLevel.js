/**
 * The character level, obtained by adding all levels in each class
 * @param state
 * @returns {number}
 */
module.exports = state => state.classes.reduce((prev, curr) => prev + curr.levels, 0)
