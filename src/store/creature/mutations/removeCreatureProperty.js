module.exports = ({ state }, { id }) => {
    const i = state.properties.findIndex(p => p.id === id)
    if (i >= 0) {
        state.properties.splice(i, 1)
    }
}
