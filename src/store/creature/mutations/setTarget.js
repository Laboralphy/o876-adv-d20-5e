module.exports = ({ state }, { target }) => {
    if (target) {
        state.target = target._state
    } else {
        state.target = null
    }
}