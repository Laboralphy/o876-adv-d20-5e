module.exports = ({ state }, { effect }) => {
    const id = effect.id
    const nIndex = state.effects.findIndex(eff => eff.id === id)
    if (nIndex >= 0) {
        state.effects.splice(nIndex, 1)
    }
}
