module.exports = ({ state, getters }, { effect }) => {
    state.effects.push(effect)
}
