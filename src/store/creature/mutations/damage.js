module.exports = ({ state }, { amount }) => {
    state.gauges.damage = state.gauges.damage + amount
}
