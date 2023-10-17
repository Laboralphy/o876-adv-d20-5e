module.exports = ({ state }, { counter, value = undefined, max = undefined, create = false }) => {
    const bPresent = counter in state.counters
    if (bPresent || create) {
        if (!bPresent) {
            state.counters[counter] = {
                value: 0
            }
        }
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