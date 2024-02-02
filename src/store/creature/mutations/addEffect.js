module.exports = ({ state, getters }, { effect, duration = undefined }) => {
    if (duration) {
        effect.duration = duration
    }
    const n = state.effects.push(effect)
    return state.effects[n - 1]
}
