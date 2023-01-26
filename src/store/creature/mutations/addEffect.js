module.exports = ({ state, getters }, { effect, duration = undefined }) => {
    const id = effect.id
    if (duration) {
        effect.duration = duration
    }
    state.effects.push(effect)
    return state.effects.find(eff => eff.id === id)
}
