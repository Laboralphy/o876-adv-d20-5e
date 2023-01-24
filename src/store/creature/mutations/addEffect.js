module.exports = ({ state, getters }, { effect }) => {
    const id = effect.id
    state.effects.push(effect)
    return state.effects.find(eff => eff.id === id)
}
