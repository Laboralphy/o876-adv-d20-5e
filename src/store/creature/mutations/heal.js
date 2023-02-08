module.exports = ({ state }, { amount }) => {
    state.gauges.damage = Math.max(0, state.gauges.damage - amount)
}
