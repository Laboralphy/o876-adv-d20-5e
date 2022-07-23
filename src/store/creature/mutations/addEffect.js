module.exports = ({ state }, { effect }) => {
    state.effects.push(effect)
}
