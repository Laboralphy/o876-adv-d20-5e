/**
 * The proficiency bonus is based on the character level
 * Math.floor((clvl - 1)/4) + 2
 */
module.exports = (state, getters) => Math.floor((getters.getLevel - 1) / 4) + 2
