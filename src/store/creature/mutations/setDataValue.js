module.exports = ({ state }, { key, value }) => {
    state.data[key] = value
}