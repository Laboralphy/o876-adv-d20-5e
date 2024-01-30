const CONSTS = require('../../../consts')

/**
 *
 * @param state
 * @param getters
 * @returns {boolean}
 */
module.exports = (state, getters) => !getters.getConditionSet.has(CONSTS.CONDITION_INCAPACITATED)