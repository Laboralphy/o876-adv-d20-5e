/**
 *
 * @param state
 * @param getters
 * @returns {number}
 */
module.exports = (state, getters) => Math.floor(getters.getProficiencyBonus / 2)