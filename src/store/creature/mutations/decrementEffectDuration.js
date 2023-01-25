module.exports = ({ state }, { effect }) => {
    const id = effect.id
    const oFoundEffect = state.effects.find(eff => eff.id === id)
    if (oFoundEffect) {
        --oFoundEffect.duration
    }
}
