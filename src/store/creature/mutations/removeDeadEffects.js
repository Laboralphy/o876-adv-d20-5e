module.exports = ({ state }) => {
    let i = 0
    while (i < state.effects.length) {
        if (state.effects[i].duration <= 0) {
            state.effects.splice(i, 1)
        } else {
            ++i
        }
    }
}