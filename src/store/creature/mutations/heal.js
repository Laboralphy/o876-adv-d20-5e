module.exports = ({ state }, { amount = Infinity } = {}) => {
    if (isNaN(amount)) {
        throw new TypeError('heal amount must be a number. "' + amount + '" given')
    }
    state.gauges.damage = Math.max(0, state.gauges.damage - Math.max(0, amount))
}
