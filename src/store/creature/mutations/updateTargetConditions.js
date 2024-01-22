const { convertConditionsToArray } = require('../common/convert-conditions')
/**
 * ON NE PEUT PAS passer dans le paylaod d'une mutation, un objet possédant un store, et interroger ce store.
 * @param state
 * @param conditions
 * @param effects {string[]}
 * @param id {string} if specified, change creature id
 */
module.exports = ({ state }, { id = undefined, conditions, effects }) => {
    if (id) {
        state.target.id = id
    }
    state.target.active = true
    state.target.conditions = convertConditionsToArray(conditions)
    state.target.effects.splice(0, state.target.effects.length, ...effects)
}