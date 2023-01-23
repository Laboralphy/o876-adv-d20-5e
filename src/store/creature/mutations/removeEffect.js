module.exports = ({ state }, { effect }) => {
    const nIndex = state.effects.indexOf(effect)
    if (nIndex >= 0) {
        state.effects.splice(nIndex, 1)
    }
}
