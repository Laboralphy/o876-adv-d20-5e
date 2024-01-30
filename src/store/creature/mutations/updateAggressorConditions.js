const { convertConditionsToArray } = require('../common/convert-conditions')

/**
 * ON NE PEUT PAS passer dans le paylaod d'une mutation, un objet possédant un store, et interroger ce store.
 * @param state
 * @param conditions
 * @param effects {string[]}
 * @param itemProperties {string[]}
 * @param id {number} if specified, change creature id
 */
module.exports = ({ state }, { id = undefined, conditions, effects, itemProperties }) => {
    const sa = state.aggressor
    if (id) {
        sa.id = id
    }
    sa.active = true
    sa.conditions.splice(0, sa.conditions.length, ...conditions)
    sa.effects.splice(0, sa.effects.length, ...effects)
    sa.itemProperties.splice(0, sa.itemProperties, ...itemProperties)
}