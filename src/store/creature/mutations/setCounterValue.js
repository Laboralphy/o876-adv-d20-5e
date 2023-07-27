module.exports = ({ state }, { counter, value = undefined, max = undefined }) => {
    if (counter in state.counters) {
        if (value !== undefined) {
            state.counters[counter].value = value
        }
        if (max !== undefined) {
            state.counters[counter].max = max
        }
    }
}