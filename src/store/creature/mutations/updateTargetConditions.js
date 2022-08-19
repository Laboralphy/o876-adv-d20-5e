/**
 * ON NE PEUT PAS passer dans le paylaod d'une mutation, un objet possédant un store, et interroger ce store.
 * @param state
 * @param conditions
 */
module.exports = ({ state }, { conditions }) => {
    state.target.active = true
    state.target.conditions = [...conditions]
}