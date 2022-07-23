module.exports = ({ state }, { attribute, value }) => {
    if (attribute in state.abilities) {
        state.abilities[attribute] = value
    }
}
