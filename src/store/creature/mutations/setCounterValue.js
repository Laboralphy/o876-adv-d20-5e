module.exports = ({ state }, { counter, value = undefined, max = undefined, create = false }) => {
    const bPresent = counter in state.counters
    if (bPresent || create) {
        if (!bPresent) {
            state.counters[counter] = {
                value: 0
            }
        }
        if (max !== undefined) {
            state.counters[counter].max = max
        }
        if (value !== undefined) {
            const nMax = state.counters[counter].max || Infinity
            state.counters[counter].value = Math.min(value, nMax)
        }
    } else {
        throw new Error('Cannot create new counter ("create" property must be set to "true")')
    }
}