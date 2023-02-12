module.exports = ({ state }, { counter }) => {
    if (counter in state.counters) {
        ++state.counters[counter]
    } else {
        state.counters[counter] = 1
    }
}
