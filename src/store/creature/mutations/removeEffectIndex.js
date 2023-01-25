module.exports = ({ state }, { index }) => {
    if (index >= 0) {
        state.effects.splice(index, 1)
    }
}
