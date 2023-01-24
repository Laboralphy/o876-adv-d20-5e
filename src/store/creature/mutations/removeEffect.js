module.exports = ({ state }, { id }) => {
    const nIndex = state.effects.findIndex(effect => effect.id === id)
    if (nIndex >= 0) {
        state.effects.splice(nIndex, 1)
    }
}
