module.exports = ({ state }, { amount }) => {
    if (isNaN(amount)) {
        throw new TypeError('damage amount must be a number. "' + amount + '" given')
    }
    state.gauges.damage = state.gauges.damage + Math.max(0, amount)
}
