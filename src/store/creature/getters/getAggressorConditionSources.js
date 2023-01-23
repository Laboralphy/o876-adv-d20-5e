/**
 *
 * @param state
 * @param getters {D20CreatureStoreGetters}
 * @returns {{}}
 */
const { convertConditionsToSet } = require("../common/convert-conditions");
module.exports = (state, getters) => {
    const creature = getters.getAggressor
    if (creature) {
        return convertConditionsToSet(creature.conditions)
    } else {
        return {}
    }
}
