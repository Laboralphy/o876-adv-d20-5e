module.exports = ({ state }, { counter, value = undefined, max = undefined, create = false }) => {
    if ((counter in state.counters) || create) {
        if (value !== undefined) {
            state.counters[counter].value = value
        }
        if (max !== undefined) {
            state.counters[counter].max = max
        }
    } else {
        throw new Error('Cannot create new counter ("create" property must be set to "true")')
    }
}