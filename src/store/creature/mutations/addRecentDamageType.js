module.exports = ({ state }, { type, amount }) => {
    if (type in state.recentDamageTypes) {
        state.recentDamageTypes[type] += amount
    } else {
        if (amount > 0) {
            state.recentDamageTypes[type] = amount
        }
    }
}