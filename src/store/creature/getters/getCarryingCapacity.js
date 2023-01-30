const CONSTS = require('../../../consts')

/**
 * @param state
 * @param getters
 * @param externals
 * @returns {number}
 */
module.exports = (state, getters, externals) => {
    const { CARRYING_CAPACITY_FACTOR } = externals.data.variables
    const nStrength = getters.getAbilityValues[CONSTS.ABILITY_STRENGTH]
    return getters.getSizeProperties.carryingCapacity * CARRYING_CAPACITY_FACTOR * nStrength
}