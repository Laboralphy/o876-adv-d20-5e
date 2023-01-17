/**
 * ON NE PEUT PAS passer dans le paylaod d'une mutation, un objet possédant un store, et interroger ce store.
 * @param state
 * @param conditions
 * @param id {number} if specified, change creature id
 */
module.exports = ({ state }, { id = undefined, conditions }) => {
    if (id) {
        state.target.id = id
    }
    state.target.active = true
    state.target.conditions = conditions
}