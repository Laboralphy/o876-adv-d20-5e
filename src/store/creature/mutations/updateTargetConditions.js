const { convertConditionsToArray } = require('../common/convert-conditions')

/**
 * ON NE PEUT PAS passer dans le paylaod d'une mutation, un objet possédant un store, et interroger ce store.
 * @param state
 * @param conditions {Object<string, Set<string>>}
 * @param effects {string[]}
 * @param itemProperties {string[]}
 * @param id {string} if specified, change creature id
 */
module.exports = ({ state }, { id = undefined, conditions, effects, itemProperties }) => {
    const st = state.target
    if (id) {
        st.id = id
    }
    st.active = true
    // On récupère les conditions sous forme de set, on doit les convertir en tableau avant de les intégrer au state
    st.conditions = convertConditionsToArray(conditions)
    st.effects.splice(0, st.effects.length, ...effects)
    st.itemProperties.splice(0, st.itemProperties.length, ...itemProperties)
}