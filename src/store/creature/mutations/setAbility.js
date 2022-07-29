module.exports = ({ state }, { ability, value }) => {
    if (ability in state.abilities) {
        if (isNaN(value)) {
            throw new TypeError('Ability value is Not a Numeric : "' + value + '"')
        }
        state.abilities[ability] = value
    } else {
        throw new Error('Unknown ability : "' + ability + '"')
    }
}
